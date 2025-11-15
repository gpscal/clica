import { AuthState, UserInfo } from "@shared/proto/clino/account"
import { type EmptyRequest, String } from "@shared/proto/clino/common"
import { Controller } from "@/core/controller"
import { getRequestRegistry, type StreamingResponseHandler } from "@/core/controller/grpc-handler"
import { LogoutReason } from "./types"

// Stub type for backward compatibility with telemetry
export interface ClineAccountUserInfo {
	id: string
	email?: string
	displayName?: string
}

export class AuthService {
	protected static instance: AuthService | null = null
	protected _authenticated: boolean = false
	protected _activeAuthStatusUpdateHandlers = new Set<StreamingResponseHandler<AuthState>>()
	protected _handlerToController = new Map<StreamingResponseHandler<AuthState>, Controller>()
	protected _controller: Controller

	/**
	 * Creates an instance of AuthService.
	 * @param controller - Optional reference to the Controller instance.
	 */
	protected constructor(controller: Controller) {
		this._controller = controller
	}

	/**
	 * Gets the singleton instance of AuthService.
	 * @param controller - Optional reference to the Controller instance.
	 * @returns The singleton instance of AuthService.
	 */
	public static getInstance(controller?: Controller): AuthService {
		if (!AuthService.instance) {
			if (!controller) {
				console.warn("Extension context was not provided to AuthService.getInstance, using default context")
				controller = {} as Controller
			}
			AuthService.instance = new AuthService(controller)
		}
		if (controller !== undefined && AuthService.instance) {
			AuthService.instance.controller = controller
		}
		return AuthService.instance!
	}

	set controller(controller: Controller) {
		this._controller = controller
	}

	/**
	 * Returns the current authentication token with the appropriate prefix.
	 * Refreshing it if necessary.
	 */
	async getAuthToken(): Promise<string | null> {
		return null
	}

	getInfo(): AuthState {
		if (!this._authenticated) {
			return AuthState.create({})
		}

		const user = UserInfo.create({
			uid: "local-user",
			displayName: "Local User",
		})

		return AuthState.create({
			user,
		})
	}

	async createAuthRequest(): Promise<String> {
		return String.create({
			value: "Clino account authentication has been removed. Configure your preferred provider API keys in Settings.",
		})
	}

	async handleDeauth(_reason: LogoutReason = LogoutReason.UNKNOWN): Promise<void> {
		this._authenticated = false
		await this.sendAuthStatusUpdate()
	}

	async handleAuthCallback(_authorizationCode: string, _provider: string): Promise<void> {
		throw new Error("Authentication callbacks are no longer supported.")
	}

	/**
	 * @deprecated Use handleDeauth() instead. Storage clearing is now handled consistently within the auth domain.
	 * Clear the authentication token from the extension's storage.
	 * This is typically called when the user logs out.
	 */
	async clearAuthToken(): Promise<void> {
		return
	}

	/**
	 * Restores the authentication data from the extension's storage.
	 * This now simply clears any cached authentication state.
	 */
	async restoreRefreshTokenAndRetrieveAuthInfo(): Promise<void> {
		this._authenticated = false
		await this.sendAuthStatusUpdate()
	}

	/**
	 * Subscribe to authStatusUpdate events
	 * @param controller The controller instance
	 * @param request The empty request
	 * @param responseStream The streaming response handler
	 * @param requestId The ID of the request (passed by the gRPC handler)
	 */
	async subscribeToAuthStatusUpdate(
		controller: Controller,
		_request: EmptyRequest,
		responseStream: StreamingResponseHandler<AuthState>,
		requestId?: string,
	): Promise<void> {
		this._activeAuthStatusUpdateHandlers.add(responseStream)
		this._handlerToController.set(responseStream, controller)
		const cleanup = () => {
			this._activeAuthStatusUpdateHandlers.delete(responseStream)
			this._handlerToController.delete(responseStream)
		}
		if (requestId) {
			getRequestRegistry().registerRequest(requestId, cleanup, { type: "authStatusUpdate_subscription" }, responseStream)
		}
		try {
			await this.sendAuthStatusUpdate()
		} catch (error) {
			console.error("Error sending initial auth status:", error)
			this._activeAuthStatusUpdateHandlers.delete(responseStream)
			this._handlerToController.delete(responseStream)
		}
	}

	/**
	 * Send an authStatusUpdate event to all active subscribers
	 */
	async sendAuthStatusUpdate(): Promise<void> {
		const authInfo: AuthState = this.getInfo()
		const uniqueControllers = new Set<Controller>()

		const streamSends = Array.from(this._activeAuthStatusUpdateHandlers).map(async (responseStream) => {
			const controller = this._handlerToController.get(responseStream)
			if (controller) {
				uniqueControllers.add(controller)
			}
			try {
				await responseStream(authInfo, false)
			} catch (error) {
				console.error("Error sending authStatusUpdate event:", error)
				this._activeAuthStatusUpdateHandlers.delete(responseStream)
				this._handlerToController.delete(responseStream)
			}
		})

		await Promise.all(streamSends)

		await Promise.all(Array.from(uniqueControllers).map((c) => c.postStateToWebview?.() ?? Promise.resolve()))
	}
}
