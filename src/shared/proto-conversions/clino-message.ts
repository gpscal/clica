import { ClinoAsk as AppClinoAsk, ClinoMessage as AppClinoMessage, ClinoSay as AppClinoSay } from "@shared/ExtensionMessage"

import { ClinoAsk, ClinoMessageType, ClinoSay, ClinoMessage as ProtoClinoMessage } from "@shared/proto/clino/ui"

// Helper function to convert ClinoAsk string to enum
function convertClinoAskToProtoEnum(ask: AppClinoAsk | undefined): ClinoAsk | undefined {
	if (!ask) {
		return undefined
	}

	const mapping: Record<AppClinoAsk, ClinoAsk> = {
		followup: ClinoAsk.FOLLOWUP,
		plan_mode_respond: ClinoAsk.PLAN_MODE_RESPOND,
		command: ClinoAsk.COMMAND,
		command_output: ClinoAsk.COMMAND_OUTPUT,
		completion_result: ClinoAsk.COMPLETION_RESULT,
		tool: ClinoAsk.TOOL,
		api_req_failed: ClinoAsk.API_REQ_FAILED,
		resume_task: ClinoAsk.RESUME_TASK,
		resume_completed_task: ClinoAsk.RESUME_COMPLETED_TASK,
		mistake_limit_reached: ClinoAsk.MISTAKE_LIMIT_REACHED,
		auto_approval_max_req_reached: ClinoAsk.AUTO_APPROVAL_MAX_REQ_REACHED,
		browser_action_launch: ClinoAsk.BROWSER_ACTION_LAUNCH,
		use_mcp_server: ClinoAsk.USE_MCP_SERVER,
		new_task: ClinoAsk.NEW_TASK,
		condense: ClinoAsk.CONDENSE,
		summarize_task: ClinoAsk.SUMMARIZE_TASK,
		report_bug: ClinoAsk.REPORT_BUG,
	}

	const result = mapping[ask]
	if (result === undefined) {
		console.warn(`Unknown ClinoAsk value: ${ask}`)
	}
	return result
}

// Helper function to convert ClinoAsk enum to string
function convertProtoEnumToClinoAsk(ask: ClinoAsk): AppClinoAsk | undefined {
	if (ask === ClinoAsk.UNRECOGNIZED) {
		console.warn("Received UNRECOGNIZED ClinoAsk enum value")
		return undefined
	}

	const mapping: Record<Exclude<ClinoAsk, ClinoAsk.UNRECOGNIZED>, AppClinoAsk> = {
		[ClinoAsk.FOLLOWUP]: "followup",
		[ClinoAsk.PLAN_MODE_RESPOND]: "plan_mode_respond",
		[ClinoAsk.COMMAND]: "command",
		[ClinoAsk.COMMAND_OUTPUT]: "command_output",
		[ClinoAsk.COMPLETION_RESULT]: "completion_result",
		[ClinoAsk.TOOL]: "tool",
		[ClinoAsk.API_REQ_FAILED]: "api_req_failed",
		[ClinoAsk.RESUME_TASK]: "resume_task",
		[ClinoAsk.RESUME_COMPLETED_TASK]: "resume_completed_task",
		[ClinoAsk.MISTAKE_LIMIT_REACHED]: "mistake_limit_reached",
		[ClinoAsk.AUTO_APPROVAL_MAX_REQ_REACHED]: "auto_approval_max_req_reached",
		[ClinoAsk.BROWSER_ACTION_LAUNCH]: "browser_action_launch",
		[ClinoAsk.USE_MCP_SERVER]: "use_mcp_server",
		[ClinoAsk.NEW_TASK]: "new_task",
		[ClinoAsk.CONDENSE]: "condense",
		[ClinoAsk.SUMMARIZE_TASK]: "summarize_task",
		[ClinoAsk.REPORT_BUG]: "report_bug",
	}

	return mapping[ask]
}

// Helper function to convert ClinoSay string to enum
function convertClinoSayToProtoEnum(say: AppClinoSay | undefined): ClinoSay | undefined {
	if (!say) {
		return undefined
	}

	const mapping: Record<AppClinoSay, ClinoSay> = {
		task: ClinoSay.TASK,
		error: ClinoSay.ERROR,
		api_req_started: ClinoSay.API_REQ_STARTED,
		api_req_finished: ClinoSay.API_REQ_FINISHED,
		text: ClinoSay.TEXT,
		reasoning: ClinoSay.REASONING,
		completion_result: ClinoSay.COMPLETION_RESULT_SAY,
		user_feedback: ClinoSay.USER_FEEDBACK,
		user_feedback_diff: ClinoSay.USER_FEEDBACK_DIFF,
		api_req_retried: ClinoSay.API_REQ_RETRIED,
		command: ClinoSay.COMMAND_SAY,
		command_output: ClinoSay.COMMAND_OUTPUT_SAY,
		tool: ClinoSay.TOOL_SAY,
		shell_integration_warning: ClinoSay.SHELL_INTEGRATION_WARNING,
		shell_integration_warning_with_suggestion: ClinoSay.SHELL_INTEGRATION_WARNING,
		browser_action_launch: ClinoSay.BROWSER_ACTION_LAUNCH_SAY,
		browser_action: ClinoSay.BROWSER_ACTION,
		browser_action_result: ClinoSay.BROWSER_ACTION_RESULT,
		mcp_server_request_started: ClinoSay.MCP_SERVER_REQUEST_STARTED,
		mcp_server_response: ClinoSay.MCP_SERVER_RESPONSE,
		mcp_notification: ClinoSay.MCP_NOTIFICATION,
		use_mcp_server: ClinoSay.USE_MCP_SERVER_SAY,
		diff_error: ClinoSay.DIFF_ERROR,
		deleted_api_reqs: ClinoSay.DELETED_API_REQS,
		clineignore_error: ClinoSay.CLINEIGNORE_ERROR,
		checkpoint_created: ClinoSay.CHECKPOINT_CREATED,
		load_mcp_documentation: ClinoSay.LOAD_MCP_DOCUMENTATION,
		info: ClinoSay.INFO,
		task_progress: ClinoSay.TASK_PROGRESS,
		error_retry: ClinoSay.ERROR_RETRY,
	}

	const result = mapping[say]
	if (result === undefined) {
		console.warn(`Unknown ClinoSay value: ${say}`)
	}
	return result
}

// Helper function to convert ClinoSay enum to string
function convertProtoEnumToClinoSay(say: ClinoSay): AppClinoSay | undefined {
	if (say === ClinoSay.UNRECOGNIZED) {
		console.warn("Received UNRECOGNIZED ClinoSay enum value")
		return undefined
	}

	const mapping: Record<Exclude<ClinoSay, ClinoSay.UNRECOGNIZED>, AppClinoSay> = {
		[ClinoSay.TASK]: "task",
		[ClinoSay.ERROR]: "error",
		[ClinoSay.API_REQ_STARTED]: "api_req_started",
		[ClinoSay.API_REQ_FINISHED]: "api_req_finished",
		[ClinoSay.TEXT]: "text",
		[ClinoSay.REASONING]: "reasoning",
		[ClinoSay.COMPLETION_RESULT_SAY]: "completion_result",
		[ClinoSay.USER_FEEDBACK]: "user_feedback",
		[ClinoSay.USER_FEEDBACK_DIFF]: "user_feedback_diff",
		[ClinoSay.API_REQ_RETRIED]: "api_req_retried",
		[ClinoSay.COMMAND_SAY]: "command",
		[ClinoSay.COMMAND_OUTPUT_SAY]: "command_output",
		[ClinoSay.TOOL_SAY]: "tool",
		[ClinoSay.SHELL_INTEGRATION_WARNING]: "shell_integration_warning",
		[ClinoSay.BROWSER_ACTION_LAUNCH_SAY]: "browser_action_launch",
		[ClinoSay.BROWSER_ACTION]: "browser_action",
		[ClinoSay.BROWSER_ACTION_RESULT]: "browser_action_result",
		[ClinoSay.MCP_SERVER_REQUEST_STARTED]: "mcp_server_request_started",
		[ClinoSay.MCP_SERVER_RESPONSE]: "mcp_server_response",
		[ClinoSay.MCP_NOTIFICATION]: "mcp_notification",
		[ClinoSay.USE_MCP_SERVER_SAY]: "use_mcp_server",
		[ClinoSay.DIFF_ERROR]: "diff_error",
		[ClinoSay.DELETED_API_REQS]: "deleted_api_reqs",
		[ClinoSay.CLINEIGNORE_ERROR]: "clineignore_error",
		[ClinoSay.CHECKPOINT_CREATED]: "checkpoint_created",
		[ClinoSay.LOAD_MCP_DOCUMENTATION]: "load_mcp_documentation",
		[ClinoSay.INFO]: "info",
		[ClinoSay.TASK_PROGRESS]: "task_progress",
		[ClinoSay.ERROR_RETRY]: "error_retry",
	}

	return mapping[say]
}

/**
 * Convert application ClinoMessage to proto ClinoMessage
 */
export function convertClinoMessageToProto(message: AppClinoMessage): ProtoClinoMessage {
	// For sending messages, we need to provide values for required proto fields
	const askEnum = message.ask ? convertClinoAskToProtoEnum(message.ask) : undefined
	const sayEnum = message.say ? convertClinoSayToProtoEnum(message.say) : undefined

	// Determine appropriate enum values based on message type
	let finalAskEnum: ClinoAsk = ClinoAsk.FOLLOWUP // Proto default
	let finalSayEnum: ClinoSay = ClinoSay.TEXT // Proto default

	if (message.type === "ask") {
		finalAskEnum = askEnum ?? ClinoAsk.FOLLOWUP // Use FOLLOWUP as default for ask messages
	} else if (message.type === "say") {
		finalSayEnum = sayEnum ?? ClinoSay.TEXT // Use TEXT as default for say messages
	}

	const protoMessage: ProtoClinoMessage = {
		ts: message.ts,
		type: message.type === "ask" ? ClinoMessageType.ASK : ClinoMessageType.SAY,
		ask: finalAskEnum,
		say: finalSayEnum,
		text: message.text ?? "",
		reasoning: message.reasoning ?? "",
		images: message.images ?? [],
		files: message.files ?? [],
		partial: message.partial ?? false,
		lastCheckpointHash: message.lastCheckpointHash ?? "",
		isCheckpointCheckedOut: message.isCheckpointCheckedOut ?? false,
		isOperationOutsideWorkspace: message.isOperationOutsideWorkspace ?? false,
		conversationHistoryIndex: message.conversationHistoryIndex ?? 0,
		conversationHistoryDeletedRange: message.conversationHistoryDeletedRange
			? {
					startIndex: message.conversationHistoryDeletedRange[0],
					endIndex: message.conversationHistoryDeletedRange[1],
				}
			: undefined,
		// Additional optional fields for specific ask/say types
		sayTool: undefined,
		sayBrowserAction: undefined,
		browserActionResult: undefined,
		askUseMcpServer: undefined,
		planModeResponse: undefined,
		askQuestion: undefined,
		askNewTask: undefined,
		apiReqInfo: undefined,
	}

	return protoMessage
}

/**
 * Convert proto ClinoMessage to application ClinoMessage
 */
export function convertProtoToClinoMessage(protoMessage: ProtoClinoMessage): AppClinoMessage {
	const message: AppClinoMessage = {
		ts: protoMessage.ts,
		type: protoMessage.type === ClinoMessageType.ASK ? "ask" : "say",
	}

	// Convert ask enum to string
	if (protoMessage.type === ClinoMessageType.ASK) {
		const ask = convertProtoEnumToClinoAsk(protoMessage.ask)
		if (ask !== undefined) {
			message.ask = ask
		}
	}

	// Convert say enum to string
	if (protoMessage.type === ClinoMessageType.SAY) {
		const say = convertProtoEnumToClinoSay(protoMessage.say)
		if (say !== undefined) {
			message.say = say
		}
	}

	// Convert other fields - preserve empty strings as they may be intentional
	if (protoMessage.text !== "") {
		message.text = protoMessage.text
	}
	if (protoMessage.reasoning !== "") {
		message.reasoning = protoMessage.reasoning
	}
	if (protoMessage.images.length > 0) {
		message.images = protoMessage.images
	}
	if (protoMessage.files.length > 0) {
		message.files = protoMessage.files
	}
	if (protoMessage.partial) {
		message.partial = protoMessage.partial
	}
	if (protoMessage.lastCheckpointHash !== "") {
		message.lastCheckpointHash = protoMessage.lastCheckpointHash
	}
	if (protoMessage.isCheckpointCheckedOut) {
		message.isCheckpointCheckedOut = protoMessage.isCheckpointCheckedOut
	}
	if (protoMessage.isOperationOutsideWorkspace) {
		message.isOperationOutsideWorkspace = protoMessage.isOperationOutsideWorkspace
	}
	if (protoMessage.conversationHistoryIndex !== 0) {
		message.conversationHistoryIndex = protoMessage.conversationHistoryIndex
	}

	// Convert conversationHistoryDeletedRange from object to tuple
	if (protoMessage.conversationHistoryDeletedRange) {
		message.conversationHistoryDeletedRange = [
			protoMessage.conversationHistoryDeletedRange.startIndex,
			protoMessage.conversationHistoryDeletedRange.endIndex,
		]
	}

	return message
}
