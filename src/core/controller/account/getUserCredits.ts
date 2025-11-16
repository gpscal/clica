import { UserCreditsData } from "@shared/proto/clica/account"
import type { EmptyRequest } from "@shared/proto/clica/common"
import type { Controller } from "../index"

/**
 * Returns zeroed credit information now that Clica accounts are removed.
 */
export async function getUserCredits(_controller: Controller, _request: EmptyRequest): Promise<UserCreditsData> {
	return UserCreditsData.create({
		balance: { currentBalance: 0 },
		usageTransactions: [],
		paymentTransactions: [],
	})
}
