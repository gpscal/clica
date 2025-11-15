import type { ModelFamily } from "@/shared/prompts"
import type { ClinoDefaultTool } from "@/shared/tools"
import type { SystemPromptContext } from "./types"

export interface ClineToolSpec {
	variant: ModelFamily
	id: ClinoDefaultTool
	name: string
	description: string
	instruction?: string
	contextRequirements?: (context: SystemPromptContext) => boolean
	parameters?: Array<ClineToolSpecParameter>
}

interface ClineToolSpecParameter {
	name: string
	required: boolean
	instruction: string
	usage?: string
	dependencies?: ClinoDefaultTool[]
	description?: string
	contextRequirements?: (context: SystemPromptContext) => boolean
}
