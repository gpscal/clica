package task

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"

	"github.com/clino/cli/pkg/cli/display"
	"github.com/clino/cli/pkg/cli/global"
	"github.com/clino/cli/pkg/cli/types"
	"github.com/clino/grpc-go/clino"
)

// ListTasksFromDisk reads task history directly from disk
func ListTasksFromDisk() error {
	// Get the task history file path
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("failed to get home directory: %w", err)
	}

	filePath := filepath.Join(homeDir, ".clino", "data", "state", "taskHistory.json")

	// Read the file
	data, err := os.ReadFile(filePath)
	if err != nil {
		if os.IsNotExist(err) {
			fmt.Println("No task history found.")
			return nil
		}
		return fmt.Errorf("failed to read task history: %w", err)
	}

	// Parse JSON into intermediate struct
	var historyItems []types.HistoryItem
	if err := json.Unmarshal(data, &historyItems); err != nil {
		return fmt.Errorf("failed to parse task history: %w", err)
	}

	if len(historyItems) == 0 {
		fmt.Println("No task history found.")
		return nil
	}

	// Sort by timestamp ascending (oldest first, newest last)
	sort.Slice(historyItems, func(i, j int) bool {
		return historyItems[i].Ts < historyItems[j].Ts
	})

	// Convert to protobuf TaskItem format for rendering
	tasks := make([]*clino.TaskItem, len(historyItems))
	for i, item := range historyItems {
		tasks[i] = &clino.TaskItem{
			Id:          item.Id,
			Task:        item.Task,
			Ts:          item.Ts,
			IsFavorited: item.IsFavorited,
			Size:        item.Size,
			TotalCost:   item.TotalCost,
			TokensIn:    item.TokensIn,
			TokensOut:   item.TokensOut,
			CacheWrites: item.CacheWrites,
			CacheReads:  item.CacheReads,
		}
	}

	// Use existing renderer
	renderer := display.NewRenderer(global.Config.OutputFormat)
	return renderer.RenderTaskList(tasks)
}
