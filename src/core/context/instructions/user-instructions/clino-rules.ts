import { getRuleFilesTotalContent, synchronizeRuleToggles } from "@core/context/instructions/user-instructions/rule-helpers"
import { formatResponse } from "@core/prompts/responses"
import { ensureRulesDirectoryExists, GlobalFileNames } from "@core/storage/disk"
import { ClinoRulesToggles } from "@shared/clino-rules"
import { fileExistsAtPath, isDirectory, readDirectory } from "@utils/fs"
import fs from "fs/promises"
import path from "path"
import { Controller } from "@/core/controller"

export const getGlobalClinoRules = async (globalClinoRulesFilePath: string, toggles: ClinoRulesToggles) => {
	if (await fileExistsAtPath(globalClinoRulesFilePath)) {
		if (await isDirectory(globalClinoRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(globalClinoRulesFilePath)
				const rulesFilesTotalContent = await getRuleFilesTotalContent(rulesFilePaths, globalClinoRulesFilePath, toggles)
				if (rulesFilesTotalContent) {
					const clinoRulesFileInstructions = formatResponse.clinoRulesGlobalDirectoryInstructions(
						globalClinoRulesFilePath,
						rulesFilesTotalContent,
					)
					return clinoRulesFileInstructions
				}
			} catch {
				console.error(`Failed to read .clinerules directory at ${globalClinoRulesFilePath}`)
			}
		} else {
			console.error(`${globalClinoRulesFilePath} is not a directory`)
			return undefined
		}
	}

	return undefined
}

export const getLocalClinoRules = async (cwd: string, toggles: ClinoRulesToggles) => {
	const clinoRulesFilePath = path.resolve(cwd, GlobalFileNames.clinoRules)

	let clinoRulesFileInstructions: string | undefined

	if (await fileExistsAtPath(clinoRulesFilePath)) {
		if (await isDirectory(clinoRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(clinoRulesFilePath, [[".clinerules", "workflows"]])

				const rulesFilesTotalContent = await getRuleFilesTotalContent(rulesFilePaths, cwd, toggles)
				if (rulesFilesTotalContent) {
					clinoRulesFileInstructions = formatResponse.clinoRulesLocalDirectoryInstructions(cwd, rulesFilesTotalContent)
				}
			} catch {
				console.error(`Failed to read .clinerules directory at ${clinoRulesFilePath}`)
			}
		} else {
			try {
				if (clinoRulesFilePath in toggles && toggles[clinoRulesFilePath] !== false) {
					const ruleFileContent = (await fs.readFile(clinoRulesFilePath, "utf8")).trim()
					if (ruleFileContent) {
						clinoRulesFileInstructions = formatResponse.clinoRulesLocalFileInstructions(cwd, ruleFileContent)
					}
				}
			} catch {
				console.error(`Failed to read .clinerules file at ${clinoRulesFilePath}`)
			}
		}
	}

	return clinoRulesFileInstructions
}

export async function refreshClinoRulesToggles(
	controller: Controller,
	workingDirectory: string,
): Promise<{
	globalToggles: ClinoRulesToggles
	localToggles: ClinoRulesToggles
}> {
	// Global toggles
	const globalClinoRulesToggles = controller.stateManager.getGlobalSettingsKey("globalClinoRulesToggles")
	const globalClinoRulesFilePath = await ensureRulesDirectoryExists()
	const updatedGlobalToggles = await synchronizeRuleToggles(globalClinoRulesFilePath, globalClinoRulesToggles)
	controller.stateManager.setGlobalState("globalClinoRulesToggles", updatedGlobalToggles)

	// Local toggles
	const localClinoRulesToggles = controller.stateManager.getWorkspaceStateKey("localClinoRulesToggles")
	const localClinoRulesFilePath = path.resolve(workingDirectory, GlobalFileNames.clinoRules)
	const updatedLocalToggles = await synchronizeRuleToggles(localClinoRulesFilePath, localClinoRulesToggles, "", [
		[".clinerules", "workflows"],
	])
	controller.stateManager.setWorkspaceState("localClinoRulesToggles", updatedLocalToggles)

	return {
		globalToggles: updatedGlobalToggles,
		localToggles: updatedLocalToggles,
	}
}
