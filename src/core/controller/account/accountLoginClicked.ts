import { EmptyRequest, String } from "@shared/proto/clica/common"
import { Controller } from "../index"

/**
 * Login is no longer required now that Clica accounts have been removed.
 */
export async function accountLoginClicked(_controller: Controller, _request: EmptyRequest): Promise<String> {
	return String.create({
		value: "Clica account authentication has been removed. Configure API keys directly in Settings.",
	})
}
