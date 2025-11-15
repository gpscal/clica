import { ModelFamily } from "@/shared/prompts"
import type { ClineToolSpec } from "../spec"

export class ClinoToolSet {
	// A list of tools mapped by model group
	private static variants: Map<ModelFamily, Set<ClinoToolSet>> = new Map()

	private constructor(
		public readonly id: string,
		public readonly config: ClineToolSpec,
	) {
		this._register()
	}

	public static register(config: ClineToolSpec): ClinoToolSet {
		return new ClinoToolSet(config.id, config)
	}

	private _register(): void {
		const existingTools = ClinoToolSet.variants.get(this.config.variant) || new Set()
		if (!Array.from(existingTools).some((t) => t.config.id === this.config.id)) {
			existingTools.add(this)
			ClinoToolSet.variants.set(this.config.variant, existingTools)
		}
	}

	public static getTools(variant: ModelFamily): ClinoToolSet[] {
		const toolsSet = ClinoToolSet.variants.get(variant) || new Set()
		const defaultSet = ClinoToolSet.variants.get(ModelFamily.GENERIC) || new Set()

		return toolsSet ? Array.from(toolsSet) : Array.from(defaultSet)
	}

	public static getRegisteredModelIds(): string[] {
		return Array.from(ClinoToolSet.variants.keys())
	}

	public static getToolByName(toolName: string, variant: ModelFamily): ClinoToolSet | undefined {
		const tools = ClinoToolSet.getTools(variant)
		return tools.find((tool) => tool.config.id === toolName)
	}

	// Return a tool by name with fallback to GENERIC and then any other variant where it exists
	public static getToolByNameWithFallback(toolName: string, variant: ModelFamily): ClinoToolSet | undefined {
		// Try exact variant first
		const exact = ClinoToolSet.getToolByName(toolName, variant)
		if (exact) {
			return exact
		}

		// Fallback to GENERIC
		const generic = ClinoToolSet.getToolByName(toolName, ModelFamily.GENERIC)
		if (generic) {
			return generic
		}

		// Final fallback: search across all registered variants
		for (const [, tools] of ClinoToolSet.variants) {
			const found = Array.from(tools).find((t) => t.config.id === toolName)
			if (found) {
				return found
			}
		}

		return undefined
	}

	// Build a list of tools for a variant using requested ids, falling back to GENERIC when missing
	public static getToolsForVariantWithFallback(variant: ModelFamily, requestedIds: string[]): ClinoToolSet[] {
		const resolved: ClinoToolSet[] = []
		for (const id of requestedIds) {
			const tool = ClinoToolSet.getToolByNameWithFallback(id, variant)
			if (tool) {
				// Avoid duplicates by id
				if (!resolved.some((t) => t.config.id === tool.config.id)) {
					resolved.push(tool)
				}
			}
		}
		return resolved
	}
}
