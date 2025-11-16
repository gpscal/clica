import { getRuleFilesTotalContent, synchronizeRuleToggles } from "@core/context/instructions/user-instructions/rule-helpers"
import { formatResponse } from "@core/prompts/responses"
import { ensureRulesDirectoryExists, GlobalFileNames } from "@core/storage/disk"
import { ClicaRulesToggles } from "@shared/clica-rules"
import { fileExistsAtPath, isDirectory, readDirectory } from "@utils/fs"
import fs from "fs/promises"
import path from "path"
import { Controller } from "@/core/controller"

export const getGlobalClicaRules = async (globalClicaRulesFilePath: string, toggles: ClicaRulesToggles) => {
	if (await fileExistsAtPath(globalClicaRulesFilePath)) {
		if (await isDirectory(globalClicaRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(globalClicaRulesFilePath)
				const rulesFilesTotalContent = await getRuleFilesTotalContent(rulesFilePaths, globalClicaRulesFilePath, toggles)
				if (rulesFilesTotalContent) {
					const clicaRulesFileInstructions = formatResponse.clicaRulesGlobalDirectoryInstructions(
						globalClicaRulesFilePath,
						rulesFilesTotalContent,
					)
					return clicaRulesFileInstructions
				}
			} catch {
				console.error(`Failed to read .clinerules directory at ${globalClicaRulesFilePath}`)
			}
		} else {
			console.error(`${globalClicaRulesFilePath} is not a directory`)
			return undefined
		}
	}

	return undefined
}

export const getLocalClicaRules = async (cwd: string, toggles: ClicaRulesToggles) => {
	const clicaRulesFilePath = path.resolve(cwd, GlobalFileNames.clicaRules)

	let clicaRulesFileInstructions: string | undefined

	if (await fileExistsAtPath(clicaRulesFilePath)) {
		if (await isDirectory(clicaRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(clicaRulesFilePath, [[".clinerules", "workflows"]])

				const rulesFilesTotalContent = await getRuleFilesTotalContent(rulesFilePaths, cwd, toggles)
				if (rulesFilesTotalContent) {
					clicaRulesFileInstructions = formatResponse.clicaRulesLocalDirectoryInstructions(cwd, rulesFilesTotalContent)
				}
			} catch {
				console.error(`Failed to read .clinerules directory at ${clicaRulesFilePath}`)
			}
		} else {
			try {
				if (clicaRulesFilePath in toggles && toggles[clicaRulesFilePath] !== false) {
					const ruleFileContent = (await fs.readFile(clicaRulesFilePath, "utf8")).trim()
					if (ruleFileContent) {
						clicaRulesFileInstructions = formatResponse.clicaRulesLocalFileInstructions(cwd, ruleFileContent)
					}
				}
			} catch {
				console.error(`Failed to read .clinerules file at ${clicaRulesFilePath}`)
			}
		}
	}

	return clicaRulesFileInstructions
}

export async function refreshClicaRulesToggles(
	controller: Controller,
	workingDirectory: string,
): Promise<{
	globalToggles: ClicaRulesToggles
	localToggles: ClicaRulesToggles
}> {
	// Global toggles
	const globalClicaRulesToggles = controller.stateManager.getGlobalSettingsKey("globalClicaRulesToggles")
	const globalClicaRulesFilePath = await ensureRulesDirectoryExists()
	const updatedGlobalToggles = await synchronizeRuleToggles(globalClicaRulesFilePath, globalClicaRulesToggles)
	controller.stateManager.setGlobalState("globalClicaRulesToggles", updatedGlobalToggles)

	// Local toggles
	const localClicaRulesToggles = controller.stateManager.getWorkspaceStateKey("localClicaRulesToggles")
	const localClicaRulesFilePath = path.resolve(workingDirectory, GlobalFileNames.clicaRules)
	const updatedLocalToggles = await synchronizeRuleToggles(localClicaRulesFilePath, localClicaRulesToggles, "", [
		[".clinerules", "workflows"],
	])
	controller.stateManager.setWorkspaceState("localClicaRulesToggles", updatedLocalToggles)

	return {
		globalToggles: updatedGlobalToggles,
		localToggles: updatedLocalToggles,
	}
}
