import { refreshClinoRulesToggles } from "@core/context/instructions/user-instructions/clino-rules"
import { refreshExternalRulesToggles } from "@core/context/instructions/user-instructions/external-rules"
import { refreshWorkflowToggles } from "@core/context/instructions/user-instructions/workflows"
import { EmptyRequest } from "@shared/proto/clino/common"
import { RefreshedRules } from "@shared/proto/clino/file"
import { getCwd, getDesktopDir } from "@/utils/path"
import type { Controller } from "../index"

/**
 * Refreshes all rule toggles (Clino, External, and Workflows)
 * @param controller The controller instance
 * @param _request The empty request
 * @returns RefreshedRules containing updated toggles for all rule types
 */
export async function refreshRules(controller: Controller, _request: EmptyRequest): Promise<RefreshedRules> {
	try {
		const cwd = await getCwd(getDesktopDir())
		const { globalToggles, localToggles } = await refreshClinoRulesToggles(controller, cwd)
		const { cursorLocalToggles, windsurfLocalToggles } = await refreshExternalRulesToggles(controller, cwd)
		const { localWorkflowToggles, globalWorkflowToggles } = await refreshWorkflowToggles(controller, cwd)

		return RefreshedRules.create({
			globalClinoRulesToggles: { toggles: globalToggles },
			localClinoRulesToggles: { toggles: localToggles },
			localCursorRulesToggles: { toggles: cursorLocalToggles },
			localWindsurfRulesToggles: { toggles: windsurfLocalToggles },
			localWorkflowToggles: { toggles: localWorkflowToggles },
			globalWorkflowToggles: { toggles: globalWorkflowToggles },
		})
	} catch (error) {
		console.error("Failed to refresh rules:", error)
		throw error
	}
}
