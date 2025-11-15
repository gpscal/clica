import { EmptyRequest, String } from "@shared/proto/clino/common"
import { Controller } from "../index"

/**
 * Login is no longer required now that Clino accounts have been removed.
 */
export async function accountLoginClicked(_controller: Controller, _request: EmptyRequest): Promise<String> {
	return String.create({
		value: "Clino account authentication has been removed. Configure API keys directly in Settings.",
	})
}
