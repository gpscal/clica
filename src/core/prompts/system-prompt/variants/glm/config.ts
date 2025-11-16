import { ModelFamily } from "@/shared/prompts"
import { ClicaDefaultTool } from "@/shared/tools"
import { SystemPromptSection } from "../../templates/placeholders"
import { createVariant } from "../variant-builder"
import { validateVariant } from "../variant-validator"
import { baseTemplate, mcp_template, rules_template, task_progress_template } from "./template"

export const config = createVariant(ModelFamily.GLM)
	.description("Prompt optimized for GLM-4.6 model with advanced agentic capabilities.")
	.version(1)
	.tags("glm", "stable")
	.labels({
		stable: 1,
		production: 1,
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
		ClicaDefaultTool.BASH,
		ClicaDefaultTool.FILE_READ,
		ClicaDefaultTool.FILE_NEW,
		ClicaDefaultTool.FILE_EDIT,
		ClicaDefaultTool.SEARCH,
		ClicaDefaultTool.LIST_FILES,
		ClicaDefaultTool.LIST_CODE_DEF,
		ClicaDefaultTool.BROWSER,
		ClicaDefaultTool.MCP_USE,
		ClicaDefaultTool.MCP_ACCESS,
		ClicaDefaultTool.ASK,
		ClicaDefaultTool.ATTEMPT,
		ClicaDefaultTool.NEW_TASK,
		ClicaDefaultTool.PLAN_MODE,
		ClicaDefaultTool.MCP_DOCS,
		ClicaDefaultTool.TODO,
	)
	.placeholders({
		MODEL_FAMILY: "glm",
	})
	.config({})
	// Override the RULES component with custom template
	.overrideComponent(SystemPromptSection.RULES, {
		template: rules_template,
	})
	// Override the TASK_PROGRESS component with custom template
	.overrideComponent(SystemPromptSection.TASK_PROGRESS, {
		template: task_progress_template,
	})
	// Override the MCP component with custom template
	.overrideComponent(SystemPromptSection.MCP, {
		template: mcp_template,
	})
	.build()

// Compile-time validation
const validationResult = validateVariant({ ...config, id: "glm" }, { strict: true })
if (!validationResult.isValid) {
	console.error("GLM variant configuration validation failed:", validationResult.errors)
	throw new Error(`Invalid GLM variant configuration: ${validationResult.errors.join(", ")}`)
}

if (validationResult.warnings.length > 0) {
	console.warn("GLM variant configuration warnings:", validationResult.warnings)
}

// Export type information for better IDE support
export type GLMVariantConfig = typeof config
