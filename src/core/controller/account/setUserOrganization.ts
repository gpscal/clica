import { UserOrganizationUpdateRequest } from "@shared/proto/clica/account"
import { Empty } from "@shared/proto/clica/common"
import type { Controller } from "../index"

/**
 * No-op now that organizations are not supported.
 */
export async function setUserOrganization(_controller: Controller, _request: UserOrganizationUpdateRequest): Promise<Empty> {
	return {}
}
