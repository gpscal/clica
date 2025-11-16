import type { ModelFamily } from "@/shared/prompts"
import type { ClicaDefaultTool } from "@/shared/tools"
import type { SystemPromptContext } from "./types"

export interface ClineToolSpec {
	variant: ModelFamily
	id: ClicaDefaultTool
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
	dependencies?: ClicaDefaultTool[]
	description?: string
	contextRequirements?: (context: SystemPromptContext) => boolean
}
