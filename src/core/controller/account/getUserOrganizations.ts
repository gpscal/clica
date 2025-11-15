import { UserOrganizationsResponse } from "@shared/proto/clino/account"
import type { EmptyRequest } from "@shared/proto/clino/common"
import type { Controller } from "../index"

/**
 * Returns an empty organization list now that Clino accounts are removed.
 */
export async function getUserOrganizations(_controller: Controller, _request: EmptyRequest): Promise<UserOrganizationsResponse> {
	return UserOrganizationsResponse.create({
		organizations: [],
	})
}
