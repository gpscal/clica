import { Controller } from "@/core/controller"

/**
 * Remote configuration previously fetched from the Clino backend is no longer supported.
 * This stub exists to keep call sites harmless.
 */
export async function fetchRemoteConfig(_controller: Controller): Promise<void> {
	return
}
