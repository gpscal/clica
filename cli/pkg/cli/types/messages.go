package types

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/clica/grpc-go/clica"
)

// ClicaMessage represents a conversation message in the CLI
type ClicaMessage struct {
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
func (m *ClicaMessage) GetTimestamp() string {
	return time.Unix(m.Timestamp/1000, 0).Format("15:04:05")
}

// IsAsk returns true if this is an ASK message
func (m *ClicaMessage) IsAsk() bool {
	return m.Type == MessageTypeAsk
}

// IsSay returns true if this is a SAY message
func (m *ClicaMessage) IsSay() bool {
	return m.Type == MessageTypeSay
}

// GetMessageKey returns a unique key for this message based on timestamp
func (m *ClicaMessage) GetMessageKey() string {
	return strconv.FormatInt(m.Timestamp, 10)
}

// ExtractMessagesFromStateJSON parses the state JSON and extracts messages
func ExtractMessagesFromStateJSON(stateJson string) ([]*ClicaMessage, error) {
	// Parse the state JSON to extract clicaMessages
	var rawState map[string]interface{}
	if err := json.Unmarshal([]byte(stateJson), &rawState); err != nil {
		return nil, fmt.Errorf("failed to parse state JSON: %w", err)
	}

	// Try to extract clicaMessages
	clicaMessagesRaw, exists := rawState["clicaMessages"]
	if !exists {
		return []*ClicaMessage{}, nil
	}

	// Convert to JSON and back to get proper Message structs
	clicaMessagesJson, err := json.Marshal(clicaMessagesRaw)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal clicaMessages: %w", err)
	}

	var messages []*ClicaMessage
	if err := json.Unmarshal(clicaMessagesJson, &messages); err != nil {
		return nil, fmt.Errorf("failed to unmarshal clicaMessages: %w", err)
	}

	return messages, nil
}

// ConvertProtoToMessage converts a protobuf ClicaMessage to our local Message struct
func ConvertProtoToMessage(protoMsg *clica.ClicaMessage) *ClicaMessage {
	var msgType MessageType
	var say, ask string

	// Convert message type
	switch protoMsg.Type {
	case clica.ClicaMessageType_ASK:
		msgType = MessageTypeAsk
		ask = convertProtoAskType(protoMsg.Ask)
	case clica.ClicaMessageType_SAY:
		msgType = MessageTypeSay
		say = convertProtoSayType(protoMsg.Say)
	default:
		msgType = MessageTypeSay
		say = "unknown"
	}

	return &ClicaMessage{
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
func convertProtoAskType(askType clica.ClicaAsk) string {
	switch askType {
	case clica.ClicaAsk_FOLLOWUP:
		return string(AskTypeFollowup)
	case clica.ClicaAsk_PLAN_MODE_RESPOND:
		return string(AskTypePlanModeRespond)
	case clica.ClicaAsk_COMMAND:
		return string(AskTypeCommand)
	case clica.ClicaAsk_COMMAND_OUTPUT:
		return string(AskTypeCommandOutput)
	case clica.ClicaAsk_COMPLETION_RESULT:
		return string(AskTypeCompletionResult)
	case clica.ClicaAsk_TOOL:
		return string(AskTypeTool)
	case clica.ClicaAsk_API_REQ_FAILED:
		return string(AskTypeAPIReqFailed)
	case clica.ClicaAsk_RESUME_TASK:
		return string(AskTypeResumeTask)
	case clica.ClicaAsk_RESUME_COMPLETED_TASK:
		return string(AskTypeResumeCompletedTask)
	case clica.ClicaAsk_MISTAKE_LIMIT_REACHED:
		return string(AskTypeMistakeLimitReached)
	case clica.ClicaAsk_AUTO_APPROVAL_MAX_REQ_REACHED:
		return string(AskTypeAutoApprovalMaxReached)
	case clica.ClicaAsk_BROWSER_ACTION_LAUNCH:
		return string(AskTypeBrowserActionLaunch)
	case clica.ClicaAsk_USE_MCP_SERVER:
		return string(AskTypeUseMcpServer)
	case clica.ClicaAsk_NEW_TASK:
		return string(AskTypeNewTask)
	case clica.ClicaAsk_CONDENSE:
		return string(AskTypeCondense)
	case clica.ClicaAsk_REPORT_BUG:
		return string(AskTypeReportBug)
	default:
		return "unknown"
	}
}

// convertProtoSayType converts protobuf say type to string
func convertProtoSayType(sayType clica.ClicaSay) string {
	switch sayType {
	case clica.ClicaSay_TASK:
		return string(SayTypeTask)
	case clica.ClicaSay_ERROR:
		return string(SayTypeError)
	case clica.ClicaSay_API_REQ_STARTED:
		return string(SayTypeAPIReqStarted)
	case clica.ClicaSay_API_REQ_FINISHED:
		return string(SayTypeAPIReqFinished)
	case clica.ClicaSay_TEXT:
		return string(SayTypeText)
	case clica.ClicaSay_REASONING:
		return string(SayTypeReasoning)
	case clica.ClicaSay_COMPLETION_RESULT_SAY:
		return string(SayTypeCompletionResult)
	case clica.ClicaSay_USER_FEEDBACK:
		return string(SayTypeUserFeedback)
	case clica.ClicaSay_USER_FEEDBACK_DIFF:
		return string(SayTypeUserFeedbackDiff)
	case clica.ClicaSay_API_REQ_RETRIED:
		return string(SayTypeAPIReqRetried)
	case clica.ClicaSay_ERROR_RETRY:
		return string(SayTypeErrorRetry)
	case clica.ClicaSay_COMMAND_SAY:
		return string(SayTypeCommand)
	case clica.ClicaSay_COMMAND_OUTPUT_SAY:
		return string(SayTypeCommandOutput)
	case clica.ClicaSay_TOOL_SAY:
		return string(SayTypeTool)
	case clica.ClicaSay_SHELL_INTEGRATION_WARNING:
		return string(SayTypeShellIntegrationWarning)
	case clica.ClicaSay_BROWSER_ACTION_LAUNCH_SAY:
		return string(SayTypeBrowserActionLaunch)
	case clica.ClicaSay_BROWSER_ACTION:
		return string(SayTypeBrowserAction)
	case clica.ClicaSay_BROWSER_ACTION_RESULT:
		return string(SayTypeBrowserActionResult)
	case clica.ClicaSay_MCP_SERVER_REQUEST_STARTED:
		return string(SayTypeMcpServerRequestStarted)
	case clica.ClicaSay_MCP_SERVER_RESPONSE:
		return string(SayTypeMcpServerResponse)
	case clica.ClicaSay_MCP_NOTIFICATION:
		return string(SayTypeMcpNotification)
	case clica.ClicaSay_USE_MCP_SERVER_SAY:
		return string(SayTypeUseMcpServer)
	case clica.ClicaSay_DIFF_ERROR:
		return string(SayTypeDiffError)
	case clica.ClicaSay_DELETED_API_REQS:
		return string(SayTypeDeletedAPIReqs)
	case clica.ClicaSay_CLINEIGNORE_ERROR:
		return string(SayTypeClineignoreError)
	case clica.ClicaSay_CHECKPOINT_CREATED:
		return string(SayTypeCheckpointCreated)
	case clica.ClicaSay_LOAD_MCP_DOCUMENTATION:
		return string(SayTypeLoadMcpDocumentation)
	case clica.ClicaSay_INFO:
		return string(SayTypeInfo)
	case clica.ClicaSay_TASK_PROGRESS:
		return string(SayTypeTaskProgress)
	default:
		return "unknown"
	}
}
