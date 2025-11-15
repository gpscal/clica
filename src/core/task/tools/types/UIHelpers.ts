import type { ClinoAsk, ClinoSay } from "@shared/ExtensionMessage"
import type { ClinoDefaultTool } from "@shared/tools"
import type { ClinoAskResponse } from "@shared/WebviewMessage"
import { telemetryService } from "@/services/telemetry"
import type { ToolParamName, ToolUse } from "../../../assistant-message"
import { showNotificationForApprovalIfAutoApprovalEnabled } from "../../utils"
import { removeClosingTag } from "../utils/ToolConstants"
import type { TaskConfig } from "./TaskConfig"

/**
 * Strongly-typed UI helper functions for tool handlers
 */
export interface StronglyTypedUIHelpers {
	// Core UI methods
	say: (type: ClinoSay, text?: string, images?: string[], files?: string[], partial?: boolean) => Promise<number | undefined>

	ask: (
		type: ClinoAsk,
		text?: string,
		partial?: boolean,
	) => Promise<{
		response: ClinoAskResponse
		text?: string
		images?: string[]
		files?: string[]
	}>

	// Utility methods
	removeClosingTag: (block: ToolUse, tag: ToolParamName, text?: string) => string
	removeLastPartialMessageIfExistsWithType: (type: "ask" | "say", askOrSay: ClinoAsk | ClinoSay) => Promise<void>

	// Approval methods
	shouldAutoApproveTool: (toolName: ClinoDefaultTool) => boolean | [boolean, boolean]
	shouldAutoApproveToolWithPath: (toolName: ClinoDefaultTool, path?: string) => Promise<boolean>
	askApproval: (messageType: ClinoAsk, message: string) => Promise<boolean>

	// Telemetry and notifications
	captureTelemetry: (toolName: ClinoDefaultTool, autoApproved: boolean, approved: boolean) => void
	showNotificationIfEnabled: (message: string) => void

	// Config access - returns the proper typed config
	getConfig: () => TaskConfig
}

/**
 * Creates strongly-typed UI helpers from a TaskConfig
 */
export function createUIHelpers(config: TaskConfig): StronglyTypedUIHelpers {
	return {
		say: config.callbacks.say,
		ask: config.callbacks.ask,
		removeClosingTag: (block: ToolUse, tag: ToolParamName, text?: string) => removeClosingTag(block, tag, text),
		removeLastPartialMessageIfExistsWithType: config.callbacks.removeLastPartialMessageIfExistsWithType,
		shouldAutoApproveTool: (toolName: ClinoDefaultTool) => config.autoApprover.shouldAutoApproveTool(toolName),
		shouldAutoApproveToolWithPath: config.callbacks.shouldAutoApproveToolWithPath,
		askApproval: async (messageType: ClinoAsk, message: string): Promise<boolean> => {
			const { response } = await config.callbacks.ask(messageType, message, false)
			return response === "yesButtonClicked"
		},
		captureTelemetry: (toolName: ClinoDefaultTool, autoApproved: boolean, approved: boolean) => {
			telemetryService.captureToolUsage(config.ulid, toolName, config.api.getModel().id, autoApproved, approved)
		},
		showNotificationIfEnabled: (message: string) => {
			showNotificationForApprovalIfAutoApprovalEnabled(
				message,
				config.autoApprovalSettings.enabled,
				config.autoApprovalSettings.enableNotifications,
			)
		},
		getConfig: () => config,
	}
}
