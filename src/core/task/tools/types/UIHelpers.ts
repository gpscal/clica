import type { ClicaAsk, ClicaSay } from "@shared/ExtensionMessage"
import type { ClicaDefaultTool } from "@shared/tools"
import type { ClicaAskResponse } from "@shared/WebviewMessage"
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
	say: (type: ClicaSay, text?: string, images?: string[], files?: string[], partial?: boolean) => Promise<number | undefined>

	ask: (
		type: ClicaAsk,
		text?: string,
		partial?: boolean,
	) => Promise<{
		response: ClicaAskResponse
		text?: string
		images?: string[]
		files?: string[]
	}>

	// Utility methods
	removeClosingTag: (block: ToolUse, tag: ToolParamName, text?: string) => string
	removeLastPartialMessageIfExistsWithType: (type: "ask" | "say", askOrSay: ClicaAsk | ClicaSay) => Promise<void>

	// Approval methods
	shouldAutoApproveTool: (toolName: ClicaDefaultTool) => boolean | [boolean, boolean]
	shouldAutoApproveToolWithPath: (toolName: ClicaDefaultTool, path?: string) => Promise<boolean>
	askApproval: (messageType: ClicaAsk, message: string) => Promise<boolean>

	// Telemetry and notifications
	captureTelemetry: (toolName: ClicaDefaultTool, autoApproved: boolean, approved: boolean) => void
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
		shouldAutoApproveTool: (toolName: ClicaDefaultTool) => config.autoApprover.shouldAutoApproveTool(toolName),
		shouldAutoApproveToolWithPath: config.callbacks.shouldAutoApproveToolWithPath,
		askApproval: async (messageType: ClicaAsk, message: string): Promise<boolean> => {
			const { response } = await config.callbacks.ask(messageType, message, false)
			return response === "yesButtonClicked"
		},
		captureTelemetry: (toolName: ClicaDefaultTool, autoApproved: boolean, approved: boolean) => {
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
