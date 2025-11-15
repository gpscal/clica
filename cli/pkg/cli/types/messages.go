package types

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/clino/grpc-go/clino"
)

// ClinoMessage represents a conversation message in the CLI
type ClinoMessage struct {
	Type                        MessageType `json:"type"`
	Text                        string      `json:"text"`
	Timestamp                   int64       `json:"ts"`
	Reasoning                   string      `json:"reasoning,omitempty"`
	Say                         string      `json:"say,omitempty"`
	Ask                         string      `json:"ask,omitempty"`
	Partial                     bool        `json:"partial,omitempty"`
	Images                      []string    `json:"images,omitempty"`
	Files                       []string    `json:"files,omitempty"`
	LastCheckpointHash          string      `json:"lastCheckpointHash,omitempty"`
	IsCheckpointCheckedOut      bool        `json:"isCheckpointCheckedOut,omitempty"`
	IsOperationOutsideWorkspace bool        `json:"isOperationOutsideWorkspace,omitempty"`
}

// MessageType represents the type of message
type MessageType string

const (
	MessageTypeAsk MessageType = "ask"
	MessageTypeSay MessageType = "say"
)

// AskType represents different types of ASK messages
type AskType string

const (
	AskTypeFollowup               AskType = "followup"
	AskTypePlanModeRespond        AskType = "plan_mode_respond"
	AskTypeCommand                AskType = "command"
	AskTypeCommandOutput          AskType = "command_output"
	AskTypeCompletionResult       AskType = "completion_result"
	AskTypeTool                   AskType = "tool"
	AskTypeAPIReqFailed           AskType = "api_req_failed"
	AskTypeResumeTask             AskType = "resume_task"
	AskTypeResumeCompletedTask    AskType = "resume_completed_task"
	AskTypeMistakeLimitReached    AskType = "mistake_limit_reached"
	AskTypeAutoApprovalMaxReached AskType = "auto_approval_max_req_reached"
	AskTypeBrowserActionLaunch    AskType = "browser_action_launch"
	AskTypeUseMcpServer           AskType = "use_mcp_server"
	AskTypeNewTask                AskType = "new_task"
	AskTypeCondense               AskType = "condense"
	AskTypeReportBug              AskType = "report_bug"
)

// SayType represents different types of SAY messages
type SayType string

const (
	SayTypeTask                    SayType = "task"
	SayTypeError                   SayType = "error"
	SayTypeAPIReqStarted           SayType = "api_req_started"
	SayTypeAPIReqFinished          SayType = "api_req_finished"
	SayTypeText                    SayType = "text"
	SayTypeReasoning               SayType = "reasoning"
	SayTypeCompletionResult        SayType = "completion_result"
	SayTypeUserFeedback            SayType = "user_feedback"
	SayTypeUserFeedbackDiff        SayType = "user_feedback_diff"
	SayTypeAPIReqRetried           SayType = "api_req_retried"
	SayTypeErrorRetry              SayType = "error_retry"
	SayTypeCommand                 SayType = "command"
	SayTypeCommandOutput           SayType = "command_output"
	SayTypeTool                    SayType = "tool"
	SayTypeShellIntegrationWarning SayType = "shell_integration_warning"
	SayTypeBrowserActionLaunch     SayType = "browser_action_launch"
	SayTypeBrowserAction           SayType = "browser_action"
	SayTypeBrowserActionResult     SayType = "browser_action_result"
	SayTypeMcpServerRequestStarted SayType = "mcp_server_request_started"
	SayTypeMcpServerResponse       SayType = "mcp_server_response"
	SayTypeMcpNotification         SayType = "mcp_notification"
	SayTypeUseMcpServer            SayType = "use_mcp_server"
	SayTypeDiffError               SayType = "diff_error"
	SayTypeDeletedAPIReqs          SayType = "deleted_api_reqs"
	SayTypeClineignoreError        SayType = "clineignore_error"
	SayTypeCheckpointCreated       SayType = "checkpoint_created"
	SayTypeLoadMcpDocumentation    SayType = "load_mcp_documentation"
	SayTypeInfo                    SayType = "info"
	SayTypeTaskProgress            SayType = "task_progress"
)

// ToolMessage represents a tool-related message
type ToolMessage struct {
	Tool                          string `json:"tool"`
	Path                          string `json:"path,omitempty"`
	Content                       string `json:"content,omitempty"`
	Diff                          string `json:"diff,omitempty"`
	Regex                         string `json:"regex,omitempty"`
	FilePattern                   string `json:"filePattern,omitempty"`
	OperationIsLocatedInWorkspace *bool  `json:"operationIsLocatedInWorkspace,omitempty"`
}

// ToolType represents different types of tools
type ToolType string

const (
	ToolTypeEditedExistingFile      ToolType = "editedExistingFile"
	ToolTypeNewFileCreated          ToolType = "newFileCreated"
	ToolTypeReadFile                ToolType = "readFile"
	ToolTypeListFilesTopLevel       ToolType = "listFilesTopLevel"
	ToolTypeListFilesRecursive      ToolType = "listFilesRecursive"
	ToolTypeListCodeDefinitionNames ToolType = "listCodeDefinitionNames"
	ToolTypeSearchFiles             ToolType = "searchFiles"
	ToolTypeWebFetch                ToolType = "webFetch"
	ToolTypeSummarizeTask           ToolType = "summarizeTask"
)

// AskData represents the parsed structure of an ASK message
type AskData struct {
	Question string   `json:"question"`
	Response string   `json:"response"`
	Options  []string `json:"options,omitempty"`
}

// APIRequestInfo represents API request information
type APIRequestInfo struct {
	Request                string                 `json:"request,omitempty"`
	TokensIn               int                    `json:"tokensIn,omitempty"`
	TokensOut              int                    `json:"tokensOut,omitempty"`
	CacheWrites            int                    `json:"cacheWrites,omitempty"`
	CacheReads             int                    `json:"cacheReads,omitempty"`
	Cost                   float64                `json:"cost,omitempty"`
	CancelReason           string                 `json:"cancelReason,omitempty"`
	StreamingFailedMessage string                 `json:"streamingFailedMessage,omitempty"`
	RetryStatus            *APIRequestRetryStatus `json:"retryStatus,omitempty"`
}

// APIRequestRetryStatus represents retry status information
type APIRequestRetryStatus struct {
	Attempt      int    `json:"attempt"`
	MaxAttempts  int    `json:"maxAttempts"`
	DelaySec     int    `json:"delaySec"`
	ErrorSnippet string `json:"errorSnippet,omitempty"`
}

// GetTimestamp returns a formatted timestamp string
func (m *ClinoMessage) GetTimestamp() string {
	return time.Unix(m.Timestamp/1000, 0).Format("15:04:05")
}

// IsAsk returns true if this is an ASK message
func (m *ClinoMessage) IsAsk() bool {
	return m.Type == MessageTypeAsk
}

// IsSay returns true if this is a SAY message
func (m *ClinoMessage) IsSay() bool {
	return m.Type == MessageTypeSay
}

// GetMessageKey returns a unique key for this message based on timestamp
func (m *ClinoMessage) GetMessageKey() string {
	return strconv.FormatInt(m.Timestamp, 10)
}

// ExtractMessagesFromStateJSON parses the state JSON and extracts messages
func ExtractMessagesFromStateJSON(stateJson string) ([]*ClinoMessage, error) {
	// Parse the state JSON to extract clinoMessages
	var rawState map[string]interface{}
	if err := json.Unmarshal([]byte(stateJson), &rawState); err != nil {
		return nil, fmt.Errorf("failed to parse state JSON: %w", err)
	}

	// Try to extract clinoMessages
	clinoMessagesRaw, exists := rawState["clinoMessages"]
	if !exists {
		return []*ClinoMessage{}, nil
	}

	// Convert to JSON and back to get proper Message structs
	clinoMessagesJson, err := json.Marshal(clinoMessagesRaw)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal clinoMessages: %w", err)
	}

	var messages []*ClinoMessage
	if err := json.Unmarshal(clinoMessagesJson, &messages); err != nil {
		return nil, fmt.Errorf("failed to unmarshal clinoMessages: %w", err)
	}

	return messages, nil
}

// ConvertProtoToMessage converts a protobuf ClinoMessage to our local Message struct
func ConvertProtoToMessage(protoMsg *clino.ClinoMessage) *ClinoMessage {
	var msgType MessageType
	var say, ask string

	// Convert message type
	switch protoMsg.Type {
	case clino.ClinoMessageType_ASK:
		msgType = MessageTypeAsk
		ask = convertProtoAskType(protoMsg.Ask)
	case clino.ClinoMessageType_SAY:
		msgType = MessageTypeSay
		say = convertProtoSayType(protoMsg.Say)
	default:
		msgType = MessageTypeSay
		say = "unknown"
	}

	return &ClinoMessage{
		Type:                        msgType,
		Text:                        protoMsg.Text,
		Timestamp:                   protoMsg.Ts,
		Reasoning:                   protoMsg.Reasoning,
		Say:                         say,
		Ask:                         ask,
		Partial:                     protoMsg.Partial,
		LastCheckpointHash:          protoMsg.LastCheckpointHash,
		IsCheckpointCheckedOut:      protoMsg.IsCheckpointCheckedOut,
		IsOperationOutsideWorkspace: protoMsg.IsOperationOutsideWorkspace,
	}
}

// convertProtoAskType converts protobuf ask type to string
func convertProtoAskType(askType clino.ClinoAsk) string {
	switch askType {
	case clino.ClinoAsk_FOLLOWUP:
		return string(AskTypeFollowup)
	case clino.ClinoAsk_PLAN_MODE_RESPOND:
		return string(AskTypePlanModeRespond)
	case clino.ClinoAsk_COMMAND:
		return string(AskTypeCommand)
	case clino.ClinoAsk_COMMAND_OUTPUT:
		return string(AskTypeCommandOutput)
	case clino.ClinoAsk_COMPLETION_RESULT:
		return string(AskTypeCompletionResult)
	case clino.ClinoAsk_TOOL:
		return string(AskTypeTool)
	case clino.ClinoAsk_API_REQ_FAILED:
		return string(AskTypeAPIReqFailed)
	case clino.ClinoAsk_RESUME_TASK:
		return string(AskTypeResumeTask)
	case clino.ClinoAsk_RESUME_COMPLETED_TASK:
		return string(AskTypeResumeCompletedTask)
	case clino.ClinoAsk_MISTAKE_LIMIT_REACHED:
		return string(AskTypeMistakeLimitReached)
	case clino.ClinoAsk_AUTO_APPROVAL_MAX_REQ_REACHED:
		return string(AskTypeAutoApprovalMaxReached)
	case clino.ClinoAsk_BROWSER_ACTION_LAUNCH:
		return string(AskTypeBrowserActionLaunch)
	case clino.ClinoAsk_USE_MCP_SERVER:
		return string(AskTypeUseMcpServer)
	case clino.ClinoAsk_NEW_TASK:
		return string(AskTypeNewTask)
	case clino.ClinoAsk_CONDENSE:
		return string(AskTypeCondense)
	case clino.ClinoAsk_REPORT_BUG:
		return string(AskTypeReportBug)
	default:
		return "unknown"
	}
}

// convertProtoSayType converts protobuf say type to string
func convertProtoSayType(sayType clino.ClinoSay) string {
	switch sayType {
	case clino.ClinoSay_TASK:
		return string(SayTypeTask)
	case clino.ClinoSay_ERROR:
		return string(SayTypeError)
	case clino.ClinoSay_API_REQ_STARTED:
		return string(SayTypeAPIReqStarted)
	case clino.ClinoSay_API_REQ_FINISHED:
		return string(SayTypeAPIReqFinished)
	case clino.ClinoSay_TEXT:
		return string(SayTypeText)
	case clino.ClinoSay_REASONING:
		return string(SayTypeReasoning)
	case clino.ClinoSay_COMPLETION_RESULT_SAY:
		return string(SayTypeCompletionResult)
	case clino.ClinoSay_USER_FEEDBACK:
		return string(SayTypeUserFeedback)
	case clino.ClinoSay_USER_FEEDBACK_DIFF:
		return string(SayTypeUserFeedbackDiff)
	case clino.ClinoSay_API_REQ_RETRIED:
		return string(SayTypeAPIReqRetried)
	case clino.ClinoSay_ERROR_RETRY:
		return string(SayTypeErrorRetry)
	case clino.ClinoSay_COMMAND_SAY:
		return string(SayTypeCommand)
	case clino.ClinoSay_COMMAND_OUTPUT_SAY:
		return string(SayTypeCommandOutput)
	case clino.ClinoSay_TOOL_SAY:
		return string(SayTypeTool)
	case clino.ClinoSay_SHELL_INTEGRATION_WARNING:
		return string(SayTypeShellIntegrationWarning)
	case clino.ClinoSay_BROWSER_ACTION_LAUNCH_SAY:
		return string(SayTypeBrowserActionLaunch)
	case clino.ClinoSay_BROWSER_ACTION:
		return string(SayTypeBrowserAction)
	case clino.ClinoSay_BROWSER_ACTION_RESULT:
		return string(SayTypeBrowserActionResult)
	case clino.ClinoSay_MCP_SERVER_REQUEST_STARTED:
		return string(SayTypeMcpServerRequestStarted)
	case clino.ClinoSay_MCP_SERVER_RESPONSE:
		return string(SayTypeMcpServerResponse)
	case clino.ClinoSay_MCP_NOTIFICATION:
		return string(SayTypeMcpNotification)
	case clino.ClinoSay_USE_MCP_SERVER_SAY:
		return string(SayTypeUseMcpServer)
	case clino.ClinoSay_DIFF_ERROR:
		return string(SayTypeDiffError)
	case clino.ClinoSay_DELETED_API_REQS:
		return string(SayTypeDeletedAPIReqs)
	case clino.ClinoSay_CLINEIGNORE_ERROR:
		return string(SayTypeClineignoreError)
	case clino.ClinoSay_CHECKPOINT_CREATED:
		return string(SayTypeCheckpointCreated)
	case clino.ClinoSay_LOAD_MCP_DOCUMENTATION:
		return string(SayTypeLoadMcpDocumentation)
	case clino.ClinoSay_INFO:
		return string(SayTypeInfo)
	case clino.ClinoSay_TASK_PROGRESS:
		return string(SayTypeTaskProgress)
	default:
		return "unknown"
	}
}
