/**
 * Minimal no-op WebviewProvider for CLI-only mode.
 * This class exists to maintain compatibility with existing code that references WebviewProvider,
 * but all webview functionality has been removed since Clino is now CLI-only.
 */
export abstract class WebviewProvider {
	private static instance: WebviewProvider | null = null
	controller: any

	constructor(readonly context: any) {
		WebviewProvider.instance = this
		// Controller will be set by the caller
		this.controller = null
	}

	async dispose() {
		if (this.controller) {
			await this.controller.dispose()
		}
		WebviewProvider.instance = null
	}

	public static getInstance(): WebviewProvider | null {
		return WebviewProvider.instance
	}

	public static getVisibleInstance(): WebviewProvider | undefined {
		return WebviewProvider.instance || undefined
	}

	public static async disposeAllInstances() {
		if (WebviewProvider.instance) {
			await WebviewProvider.instance.dispose()
		}
	}

	/**
	 * No-op methods - webview functionality removed for CLI-only mode
	 */
	abstract getWebviewUrl(path: string): string
	abstract getCspSource(): string
	abstract isVisible(): boolean
}
