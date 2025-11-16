package auth

import (
	"context"
	"fmt"

	"github.com/clica/cli/pkg/cli/global"
	"github.com/clica/cli/pkg/cli/task"
	"github.com/clica/grpc-go/clica"
)

// DefaultClineModelID is the default model ID for Clica provider.
// Clica uses OpenRouter-compatible model IDs.
const DefaultClineModelID = "anthropic/claude-sonnet-4.5"

// FetchClineModels fetches available Clica models from Clica Core.
// Note: Clica provider uses OpenRouter-compatible API and model format.
// The models are fetched using the same method as OpenRouter.
func FetchClineModels(ctx context.Context, manager *task.Manager) (map[string]*clica.OpenRouterModelInfo, error) {
	if global.Config.Verbose {
		fmt.Println("Fetching Clica models (using OpenRouter-compatible API)")
	}

	// Clica uses OpenRouter model fetching
	models, err := FetchOpenRouterModels(ctx, manager)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch Clica models: %w", err)
	}

	return models, nil
}

// GetClineModelInfo retrieves information for a specific Clica model.
func GetClineModelInfo(modelID string, models map[string]*clica.OpenRouterModelInfo) (*clica.OpenRouterModelInfo, error) {
	modelInfo, exists := models[modelID]
	if !exists {
		return nil, fmt.Errorf("model %s not found", modelID)
	}
	return modelInfo, nil
}

// SetDefaultClineModel configures the default Clica model after authentication.
// This is called automatically after successful Clica sign-in.
func SetDefaultClineModel(ctx context.Context, manager *task.Manager) error {

	// Fetch available models
	models, err := FetchClineModels(ctx, manager)
	if err != nil {
		// If we can't fetch models, we'll use the default without model info
		fmt.Printf("Warning: Could not fetch Clica models: %v\n", err)
		fmt.Printf("Using default model: %s\n", DefaultClineModelID)
		return applyDefaultClineModel(ctx, manager, nil)
	}

	// Check if default model is available
	modelInfo, err := GetClineModelInfo(DefaultClineModelID, models)
	if err != nil {
		fmt.Printf("Warning: Default model not found: %v\n", err)
		// Try to use any available model
		for modelID := range models {
			fmt.Printf("Using available model: %s\n", modelID)
			return applyClineModelConfiguration(ctx, manager, modelID, models[modelID])
		}
		return fmt.Errorf("no usable Clica models found")
	}

	if err := applyClineModelConfiguration(ctx, manager, DefaultClineModelID, modelInfo); err != nil {
		return err
	}

	if err := setWelcomeViewCompletedWithManager(ctx, manager); err != nil {
		verboseLog("Warning: Failed to mark welcome view as completed: %v", err)
	}

	return nil
}

// SelectClineModel presents a menu to select a Clica model and applies the configuration.
func SelectClineModel(ctx context.Context, manager *task.Manager) error {

	// Fetch models (uses OpenRouter-compatible format)
	models, err := FetchClineModels(ctx, manager)
	if err != nil {
		return fmt.Errorf("failed to fetch Clica models: %w", err)
	}

	// Convert to interface map for generic utilities
	modelMap := ConvertOpenRouterModelsToInterface(models)

	// Get model IDs as a sorted list
	modelIDs := ConvertModelsMapToSlice(modelMap)

	// Display selection menu
	selectedModelID, err := DisplayModelSelectionMenu(modelIDs, "Clica")
	if err != nil {
		return fmt.Errorf("model selection failed: %w", err)
	}

	// Get the selected model info
	modelInfo := models[selectedModelID]

	// Apply the configuration
	if err := applyClineModelConfiguration(ctx, manager, selectedModelID, modelInfo); err != nil {
		return err
	}

	fmt.Println()

	// Return to main auth menu after model selection
	return HandleAuthMenuNoArgs(ctx)
}

// applyClineModelConfiguration applies a Clica model configuration to both Act and Plan modes using UpdateProviderPartial.
// Clica uses OpenRouter-compatible model format.
func applyClineModelConfiguration(ctx context.Context, manager *task.Manager, modelID string, modelInfo *clica.OpenRouterModelInfo) error {
	provider := clica.ApiProvider_CLICA

	updates := ProviderUpdatesPartial{
		ModelID:   &modelID,
		ModelInfo: modelInfo,
	}

	return UpdateProviderPartial(ctx, manager, provider, updates, true)
}

func applyDefaultClineModel(ctx context.Context, manager *task.Manager, modelInfo *clica.OpenRouterModelInfo) error {
	if err := applyClineModelConfiguration(ctx, manager, DefaultClineModelID, modelInfo); err != nil {
		return err
	}

	if err := setWelcomeViewCompletedWithManager(ctx, manager); err != nil {
		verboseLog("Warning: Failed to mark welcome view as completed: %v", err)
	}

	return nil
}

func setWelcomeViewCompletedWithManager(ctx context.Context, manager *task.Manager) error {
	_, err := manager.GetClient().State.SetWelcomeViewCompleted(ctx, &clica.BooleanRequest{Value: true})
	return err
}
