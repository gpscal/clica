import { GetOrganizationCreditsRequest, OrganizationCreditsData } from "@shared/proto/clino/account"
import type { Controller } from "../index"

/**
 * Returns zeroed organization credit information now that Clino accounts are removed.
 */
export async function getOrganizationCredits(
	_controller: Controller,
	_request: GetOrganizationCreditsRequest,
): Promise<OrganizationCreditsData> {
	return OrganizationCreditsData.create({
		balance: { currentBalance: 0 },
		organizationId: "",
		usageTransactions: [],
	})
}
