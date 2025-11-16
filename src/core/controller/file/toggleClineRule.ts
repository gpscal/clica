import { getWorkspaceBasename } from "@core/workspace"
import type { ToggleClicaRuleRequest } from "@shared/proto/clica/file"
import { ToggleClicaRules } from "@shared/proto/clica/file"
import { telemetryService } from "@/services/telemetry"
import type { Controller } from "../index"

/**
 * Toggles a Clica rule (enable or disable)
 * @param controller The controller instance
 * @param request The toggle request
 * @returns The updated Clica rule toggles
 */
export async function toggleClineRule(controller: Controller, request: ToggleClicaRuleRequest): Promise<ToggleClicaRules> {
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
		const toggles = controller.stateManager.getGlobalSettingsKey("globalClicaRulesToggles")
		toggles[rulePath] = enabled
		controller.stateManager.setGlobalState("globalClicaRulesToggles", toggles)
	} else {
		const toggles = controller.stateManager.getWorkspaceStateKey("localClicaRulesToggles")
		toggles[rulePath] = enabled
		controller.stateManager.setWorkspaceState("localClicaRulesToggles", toggles)
	}

	// Track rule toggle telemetry with current task context
	if (controller.task?.ulid) {
		// Extract just the filename for privacy (no full paths)
		const ruleFileName = getWorkspaceBasename(rulePath, "Controller.toggleClineRule")
		telemetryService.captureClineRuleToggled(controller.task.ulid, ruleFileName, enabled, isGlobal)
	}

	// Get the current state to return in the response
	const globalToggles = controller.stateManager.getGlobalSettingsKey("globalClicaRulesToggles")
	const localToggles = controller.stateManager.getWorkspaceStateKey("localClicaRulesToggles")

	return ToggleClicaRules.create({
		globalClicaRulesToggles: { toggles: globalToggles },
		localClicaRulesToggles: { toggles: localToggles },
	})
}
