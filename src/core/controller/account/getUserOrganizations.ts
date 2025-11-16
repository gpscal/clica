import { UserOrganizationsResponse } from "@shared/proto/clica/account"
import type { EmptyRequest } from "@shared/proto/clica/common"
import type { Controller } from "../index"

/**
 * Returns an empty organization list now that Clica accounts are removed.
 */
export async function getUserOrganizations(_controller: Controller, _request: EmptyRequest): Promise<UserOrganizationsResponse> {
	return UserOrganizationsResponse.create({
		organizations: [],
	})
}
