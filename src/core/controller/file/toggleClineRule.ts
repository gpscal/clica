import { getWorkspaceBasename } from "@core/workspace"
import type { ToggleClinoRuleRequest } from "@shared/proto/clino/file"
import { ToggleClinoRules } from "@shared/proto/clino/file"
import { telemetryService } from "@/services/telemetry"
import type { Controller } from "../index"

/**
 * Toggles a Clino rule (enable or disable)
 * @param controller The controller instance
 * @param request The toggle request
 * @returns The updated Clino rule toggles
 */
export async function toggleClineRule(controller: Controller, request: ToggleClinoRuleRequest): Promise<ToggleClinoRules> {
	const { isGlobal, rulePath, enabled } = request

	if (!rulePath || typeof enabled !== "boolean" || typeof isGlobal !== "boolean") {
		console.error("toggleClineRule: Missing or invalid parameters", {
			rulePath,
			isGlobal: typeof isGlobal === "boolean" ? isGlobal : `Invalid: ${typeof isGlobal}`,
			enabled: typeof enabled === "boolean" ? enabled : `Invalid: ${typeof enabled}`,
		})
		throw new Error("Missing or invalid parameters for toggleClineRule")
	}

	// This is the same core logic as in the original handler
	if (isGlobal) {
		const toggles = controller.stateManager.getGlobalSettingsKey("globalClinoRulesToggles")
		toggles[rulePath] = enabled
		controller.stateManager.setGlobalState("globalClinoRulesToggles", toggles)
	} else {
		const toggles = controller.stateManager.getWorkspaceStateKey("localClinoRulesToggles")
		toggles[rulePath] = enabled
		controller.stateManager.setWorkspaceState("localClinoRulesToggles", toggles)
	}

	// Track rule toggle telemetry with current task context
	if (controller.task?.ulid) {
		// Extract just the filename for privacy (no full paths)
		const ruleFileName = getWorkspaceBasename(rulePath, "Controller.toggleClineRule")
		telemetryService.captureClineRuleToggled(controller.task.ulid, ruleFileName, enabled, isGlobal)
	}

	// Get the current state to return in the response
	const globalToggles = controller.stateManager.getGlobalSettingsKey("globalClinoRulesToggles")
	const localToggles = controller.stateManager.getWorkspaceStateKey("localClinoRulesToggles")

	return ToggleClinoRules.create({
		globalClinoRulesToggles: { toggles: globalToggles },
		localClinoRulesToggles: { toggles: localToggles },
	})
}
