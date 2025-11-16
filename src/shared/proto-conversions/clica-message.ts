import { ClicaAsk as AppClicaAsk, ClicaMessage as AppClicaMessage, ClicaSay as AppClicaSay } from "@shared/ExtensionMessage"

import { ClicaAsk, ClicaMessageType, ClicaSay, ClicaMessage as ProtoClicaMessage } from "@shared/proto/clica/ui"

// Helper function to convert ClicaAsk string to enum
function convertClicaAskToProtoEnum(ask: AppClicaAsk | undefined): ClicaAsk | undefined {
	if (!ask) {
		return undefined
	}

	const mapping: Record<AppClicaAsk, ClicaAsk> = {
		followup: ClicaAsk.FOLLOWUP,
		plan_mode_respond: ClicaAsk.PLAN_MODE_RESPOND,
		command: ClicaAsk.COMMAND,
		command_output: ClicaAsk.COMMAND_OUTPUT,
		completion_result: ClicaAsk.COMPLETION_RESULT,
		tool: ClicaAsk.TOOL,
		api_req_failed: ClicaAsk.API_REQ_FAILED,
		resume_task: ClicaAsk.RESUME_TASK,
		resume_completed_task: ClicaAsk.RESUME_COMPLETED_TASK,
		mistake_limit_reached: ClicaAsk.MISTAKE_LIMIT_REACHED,
		auto_approval_max_req_reached: ClicaAsk.AUTO_APPROVAL_MAX_REQ_REACHED,
		browser_action_launch: ClicaAsk.BROWSER_ACTION_LAUNCH,
		use_mcp_server: ClicaAsk.USE_MCP_SERVER,
		new_task: ClicaAsk.NEW_TASK,
		condense: ClicaAsk.CONDENSE,
		summarize_task: ClicaAsk.SUMMARIZE_TASK,
		report_bug: ClicaAsk.REPORT_BUG,
	}

	const result = mapping[ask]
	if (result === undefined) {
		console.warn(`Unknown ClicaAsk value: ${ask}`)
	}
	return result
}

// Helper function to convert ClicaAsk enum to string
function convertProtoEnumToClicaAsk(ask: ClicaAsk): AppClicaAsk | undefined {
	if (ask === ClicaAsk.UNRECOGNIZED) {
		console.warn("Received UNRECOGNIZED ClicaAsk enum value")
		return undefined
	}

	const mapping: Record<Exclude<ClicaAsk, ClicaAsk.UNRECOGNIZED>, AppClicaAsk> = {
		[ClicaAsk.FOLLOWUP]: "followup",
		[ClicaAsk.PLAN_MODE_RESPOND]: "plan_mode_respond",
		[ClicaAsk.COMMAND]: "command",
		[ClicaAsk.COMMAND_OUTPUT]: "command_output",
		[ClicaAsk.COMPLETION_RESULT]: "completion_result",
		[ClicaAsk.TOOL]: "tool",
		[ClicaAsk.API_REQ_FAILED]: "api_req_failed",
		[ClicaAsk.RESUME_TASK]: "resume_task",
		[ClicaAsk.RESUME_COMPLETED_TASK]: "resume_completed_task",
		[ClicaAsk.MISTAKE_LIMIT_REACHED]: "mistake_limit_reached",
		[ClicaAsk.AUTO_APPROVAL_MAX_REQ_REACHED]: "auto_approval_max_req_reached",
		[ClicaAsk.BROWSER_ACTION_LAUNCH]: "browser_action_launch",
		[ClicaAsk.USE_MCP_SERVER]: "use_mcp_server",
		[ClicaAsk.NEW_TASK]: "new_task",
		[ClicaAsk.CONDENSE]: "condense",
		[ClicaAsk.SUMMARIZE_TASK]: "summarize_task",
		[ClicaAsk.REPORT_BUG]: "report_bug",
	}

	return mapping[ask]
}

// Helper function to convert ClicaSay string to enum
function convertClicaSayToProtoEnum(say: AppClicaSay | undefined): ClicaSay | undefined {
	if (!say) {
		return undefined
	}

	const mapping: Record<AppClicaSay, ClicaSay> = {
		task: ClicaSay.TASK,
		error: ClicaSay.ERROR,
		api_req_started: ClicaSay.API_REQ_STARTED,
		api_req_finished: ClicaSay.API_REQ_FINISHED,
		text: ClicaSay.TEXT,
		reasoning: ClicaSay.REASONING,
		completion_result: ClicaSay.COMPLETION_RESULT_SAY,
		user_feedback: ClicaSay.USER_FEEDBACK,
		user_feedback_diff: ClicaSay.USER_FEEDBACK_DIFF,
		api_req_retried: ClicaSay.API_REQ_RETRIED,
		command: ClicaSay.COMMAND_SAY,
		command_output: ClicaSay.COMMAND_OUTPUT_SAY,
		tool: ClicaSay.TOOL_SAY,
		shell_integration_warning: ClicaSay.SHELL_INTEGRATION_WARNING,
		shell_integration_warning_with_suggestion: ClicaSay.SHELL_INTEGRATION_WARNING,
		browser_action_launch: ClicaSay.BROWSER_ACTION_LAUNCH_SAY,
		browser_action: ClicaSay.BROWSER_ACTION,
		browser_action_result: ClicaSay.BROWSER_ACTION_RESULT,
		mcp_server_request_started: ClicaSay.MCP_SERVER_REQUEST_STARTED,
		mcp_server_response: ClicaSay.MCP_SERVER_RESPONSE,
		mcp_notification: ClicaSay.MCP_NOTIFICATION,
		use_mcp_server: ClicaSay.USE_MCP_SERVER_SAY,
		diff_error: ClicaSay.DIFF_ERROR,
		deleted_api_reqs: ClicaSay.DELETED_API_REQS,
		clineignore_error: ClicaSay.CLINEIGNORE_ERROR,
		checkpoint_created: ClicaSay.CHECKPOINT_CREATED,
		load_mcp_documentation: ClicaSay.LOAD_MCP_DOCUMENTATION,
		info: ClicaSay.INFO,
		task_progress: ClicaSay.TASK_PROGRESS,
		error_retry: ClicaSay.ERROR_RETRY,
	}

	const result = mapping[say]
	if (result === undefined) {
		console.warn(`Unknown ClicaSay value: ${say}`)
	}
	return result
}

// Helper function to convert ClicaSay enum to string
function convertProtoEnumToClicaSay(say: ClicaSay): AppClicaSay | undefined {
	if (say === ClicaSay.UNRECOGNIZED) {
		console.warn("Received UNRECOGNIZED ClicaSay enum value")
		return undefined
	}

	const mapping: Record<Exclude<ClicaSay, ClicaSay.UNRECOGNIZED>, AppClicaSay> = {
		[ClicaSay.TASK]: "task",
		[ClicaSay.ERROR]: "error",
		[ClicaSay.API_REQ_STARTED]: "api_req_started",
		[ClicaSay.API_REQ_FINISHED]: "api_req_finished",
		[ClicaSay.TEXT]: "text",
		[ClicaSay.REASONING]: "reasoning",
		[ClicaSay.COMPLETION_RESULT_SAY]: "completion_result",
		[ClicaSay.USER_FEEDBACK]: "user_feedback",
		[ClicaSay.USER_FEEDBACK_DIFF]: "user_feedback_diff",
		[ClicaSay.API_REQ_RETRIED]: "api_req_retried",
		[ClicaSay.COMMAND_SAY]: "command",
		[ClicaSay.COMMAND_OUTPUT_SAY]: "command_output",
		[ClicaSay.TOOL_SAY]: "tool",
		[ClicaSay.SHELL_INTEGRATION_WARNING]: "shell_integration_warning",
		[ClicaSay.BROWSER_ACTION_LAUNCH_SAY]: "browser_action_launch",
		[ClicaSay.BROWSER_ACTION]: "browser_action",
		[ClicaSay.BROWSER_ACTION_RESULT]: "browser_action_result",
		[ClicaSay.MCP_SERVER_REQUEST_STARTED]: "mcp_server_request_started",
		[ClicaSay.MCP_SERVER_RESPONSE]: "mcp_server_response",
		[ClicaSay.MCP_NOTIFICATION]: "mcp_notification",
		[ClicaSay.USE_MCP_SERVER_SAY]: "use_mcp_server",
		[ClicaSay.DIFF_ERROR]: "diff_error",
		[ClicaSay.DELETED_API_REQS]: "deleted_api_reqs",
		[ClicaSay.CLINEIGNORE_ERROR]: "clineignore_error",
		[ClicaSay.CHECKPOINT_CREATED]: "checkpoint_created",
		[ClicaSay.LOAD_MCP_DOCUMENTATION]: "load_mcp_documentation",
		[ClicaSay.INFO]: "info",
		[ClicaSay.TASK_PROGRESS]: "task_progress",
		[ClicaSay.ERROR_RETRY]: "error_retry",
	}

	return mapping[say]
}

/**
 * Convert application ClicaMessage to proto ClicaMessage
 */
export function convertClicaMessageToProto(message: AppClicaMessage): ProtoClicaMessage {
	// For sending messages, we need to provide values for required proto fields
	const askEnum = message.ask ? convertClicaAskToProtoEnum(message.ask) : undefined
	const sayEnum = message.say ? convertClicaSayToProtoEnum(message.say) : undefined

	// Determine appropriate enum values based on message type
	let finalAskEnum: ClicaAsk = ClicaAsk.FOLLOWUP // Proto default
	let finalSayEnum: ClicaSay = ClicaSay.TEXT // Proto default

	if (message.type === "ask") {
		finalAskEnum = askEnum ?? ClicaAsk.FOLLOWUP // Use FOLLOWUP as default for ask messages
	} else if (message.type === "say") {
		finalSayEnum = sayEnum ?? ClicaSay.TEXT // Use TEXT as default for say messages
	}

	const protoMessage: ProtoClicaMessage = {
		ts: message.ts,
		type: message.type === "ask" ? ClicaMessageType.ASK : ClicaMessageType.SAY,
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
 * Convert proto ClicaMessage to application ClicaMessage
 */
export function convertProtoToClicaMessage(protoMessage: ProtoClicaMessage): AppClicaMessage {
	const message: AppClicaMessage = {
		ts: protoMessage.ts,
		type: protoMessage.type === ClicaMessageType.ASK ? "ask" : "say",
	}

	// Convert ask enum to string
	if (protoMessage.type === ClicaMessageType.ASK) {
		const ask = convertProtoEnumToClicaAsk(protoMessage.ask)
		if (ask !== undefined) {
			message.ask = ask
		}
	}

	// Convert say enum to string
	if (protoMessage.type === ClicaMessageType.SAY) {
		const say = convertProtoEnumToClicaSay(protoMessage.say)
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
