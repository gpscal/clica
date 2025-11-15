import { ModelFamily } from "@/shared/prompts"
import { ClinoDefaultTool } from "@/shared/tools"
import { SystemPromptSection } from "../../templates/placeholders"
import { createVariant } from "../variant-builder"
import { validateVariant } from "../variant-validator"
import { baseTemplate } from "./template"

export const config = createVariant(ModelFamily.GENERIC)
	.description("The fallback prompt for generic use cases and models.")
	.version(1)
	.tags("fallback", "stable")
	.labels({
		stable: 1,
		fallback: 1,
	})
	.template(baseTemplate)
	.components(
		SystemPromptSection.AGENT_ROLE,
		SystemPromptSection.TOOL_USE,
		SystemPromptSection.TASK_PROGRESS,
		SystemPromptSection.MCP,
		SystemPromptSection.EDITING_FILES,
		SystemPromptSection.ACT_VS_PLAN,
		SystemPromptSection.CLI_SUBAGENTS,
		SystemPromptSection.TODO,
		SystemPromptSection.CAPABILITIES,
		SystemPromptSection.RULES,
		SystemPromptSection.SYSTEM_INFO,
		SystemPromptSection.OBJECTIVE,
		SystemPromptSection.USER_INSTRUCTIONS,
	)
	.tools(
		ClinoDefaultTool.BASH,
		ClinoDefaultTool.FILE_READ,
		ClinoDefaultTool.FILE_NEW,
		ClinoDefaultTool.FILE_EDIT,
		ClinoDefaultTool.SEARCH,
		ClinoDefaultTool.LIST_FILES,
		ClinoDefaultTool.LIST_CODE_DEF,
		ClinoDefaultTool.BROWSER,
		ClinoDefaultTool.MCP_USE,
		ClinoDefaultTool.MCP_ACCESS,
		ClinoDefaultTool.ASK,
		ClinoDefaultTool.ATTEMPT,
		ClinoDefaultTool.NEW_TASK,
		ClinoDefaultTool.PLAN_MODE,
		ClinoDefaultTool.MCP_DOCS,
		ClinoDefaultTool.TODO,
	)
	.placeholders({
		MODEL_FAMILY: "generic",
	})
	.config({})
	.build()

// Compile-time validation
const validationResult = validateVariant({ ...config, id: "generic" }, { strict: true })
if (!validationResult.isValid) {
	console.error("Generic variant configuration validation failed:", validationResult.errors)
	throw new Error(`Invalid generic variant configuration: ${validationResult.errors.join(", ")}`)
}

if (validationResult.warnings.length > 0) {
	console.warn("Generic variant configuration warnings:", validationResult.warnings)
}

// Export type information for better IDE support
export type GenericVariantConfig = typeof config
