import { WebviewProvider } from "@/core/webview"

/**
 * No-op webview provider for CLI-only mode.
 * All webview functionality has been removed since Clica is now CLI-only.
 */
export class ExternalWebviewProvider extends WebviewProvider {
	override getWebviewUrl(_path: string): string {
		return ""
	}

	override getCspSource(): string {
		return "'none'"
	}

	override isVisible(): boolean {
		return false
	}
}
