/**
 * List of email domains that are considered trusted testers for Clino.
 */
const CLINE_TRUSTED_TESTER_DOMAINS = ["fibilabs.tech"]

/**
 * Checks if the given email belongs to a bot user.
 */
export function isClineBotUser(email: string): boolean {
	return false
}

export function isClineInternalTester(email: string): boolean {
	return isClineBotUser(email) || CLINE_TRUSTED_TESTER_DOMAINS.some((d) => email.endsWith(`@${d}`))
}
