import { ModelFamily } from "@/shared/prompts"
import { ClinoDefaultTool } from "@/shared/tools"
import { SystemPromptSection } from "../../templates/placeholders"
import { createVariant } from "../variant-builder"
import { validateVariant } from "../variant-validator"
import { baseTemplate, rules_template } from "./template"

// Type-safe variant configuration using the builder pattern
export const config = createVariant(ModelFamily.NEXT_GEN)
	.description("Prompt tailored to newer frontier models with smarter agentic capabilities.")
	.version(1)
	.tags("next-gen", "advanced", "production")
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
		MODEL_FAMILY: ModelFamily.NEXT_GEN,
	})
	.config({})
	// Override the RULES component with custom template
	.overrideComponent(SystemPromptSection.RULES, {
		template: rules_template,
	})
	.build()

// Compile-time validation
const validationResult = validateVariant({ ...config, id: "next-gen" }, { strict: true })
if (!validationResult.isValid) {
	console.error("Next-gen variant configuration validation failed:", validationResult.errors)
	throw new Error(`Invalid next-gen variant configuration: ${validationResult.errors.join(", ")}`)
}

if (validationResult.warnings.length > 0) {
	console.warn("Next-gen variant configuration warnings:", validationResult.warnings)
}

// Export type information for better IDE support
export type NextGenVariantConfig = typeof config
