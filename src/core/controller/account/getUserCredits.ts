import { UserCreditsData } from "@shared/proto/clino/account"
import type { EmptyRequest } from "@shared/proto/clino/common"
import type { Controller } from "../index"

/**
 * Returns zeroed credit information now that Clino accounts are removed.
 */
export async function getUserCredits(_controller: Controller, _request: EmptyRequest): Promise<UserCreditsData> {
	return UserCreditsData.create({
		balance: { currentBalance: 0 },
		usageTransactions: [],
		paymentTransactions: [],
	})
}
