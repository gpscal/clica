import { ModelFamily } from "@/shared/prompts"
import { ClinoDefaultTool } from "@/shared/tools"
import { SystemPromptSection } from "../../templates/placeholders"
import { createVariant } from "../variant-builder"
import { validateVariant } from "../variant-validator"
import { baseTemplate, rules_template } from "./template"

// Type-safe variant configuration using the builder pattern
export const config = createVariant(ModelFamily.GPT_5)
	.description("Prompt tailored to GPT-5")
	.version(1)
	.tags("gpt", "gpt-5", "advanced", "production")
	.labels({
		stable: 1,
		production: 1,
		advanced: 1,
	})
	.template(baseTemplate)
	.components(
		SystemPromptSection.AGENT_ROLE,
		SystemPromptSection.TOOL_USE,
		SystemPromptSection.TODO,
		SystemPromptSection.MCP,
		SystemPromptSection.EDITING_FILES,
		SystemPromptSection.ACT_VS_PLAN,
		SystemPromptSection.CLI_SUBAGENTS,
		SystemPromptSection.TASK_PROGRESS,
		SystemPromptSection.CAPABILITIES,
		SystemPromptSection.FEEDBACK,
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
		ClinoDefaultTool.WEB_FETCH,
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
		MODEL_FAMILY: ModelFamily.GPT_5,
	})
	.config({})
	// Override the RULES component with custom template
	.overrideComponent(SystemPromptSection.RULES, {
		template: rules_template,
	})
	.build()

// Compile-time validation
const validationResult = validateVariant({ ...config, id: "gpt-5" }, { strict: true })
if (!validationResult.isValid) {
	console.error("GPT-5 variant configuration validation failed:", validationResult.errors)
	throw new Error(`Invalid GPT-5 variant configuration: ${validationResult.errors.join(", ")}`)
}

if (validationResult.warnings.length > 0) {
	console.warn("GPT-5 variant configuration warnings:", validationResult.warnings)
}

// Export type information for better IDE support
export type GPT5VariantConfig = typeof config
