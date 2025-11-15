import { EmptyRequest } from "@shared/proto/clino/common"
import { ClinoMessage } from "@shared/proto/clino/ui"
import { getRequestRegistry, StreamingResponseHandler } from "../grpc-handler"
import { Controller } from "../index"

// Keep track of active partial message subscriptions
const activePartialMessageSubscriptions = new Set<StreamingResponseHandler<ClinoMessage>>()

/**
 * Subscribe to partial message events
 * @param controller The controller instance
 * @param request The empty request
 * @param responseStream The streaming response handler
 * @param requestId The ID of the request (passed by the gRPC handler)
 */
export async function subscribeToPartialMessage(
	_controller: Controller,
	_request: EmptyRequest,
	responseStream: StreamingResponseHandler<ClinoMessage>,
	requestId?: string,
): Promise<void> {
	// Add this subscription to the active subscriptions
	activePartialMessageSubscriptions.add(responseStream)

	// Register cleanup when the connection is closed
	const cleanup = () => {
		activePartialMessageSubscriptions.delete(responseStream)
	}

	// Register the cleanup function with the request registry if we have a requestId
	if (requestId) {
		getRequestRegistry().registerRequest(requestId, cleanup, { type: "partial_message_subscription" }, responseStream)
	}
}

/**
 * Send a partial message event to all active subscribers
 * @param partialMessage The ClinoMessage to send
 */
export async function sendPartialMessageEvent(partialMessage: ClinoMessage): Promise<void> {
	// Send the event to all active subscribers
	const promises = Array.from(activePartialMessageSubscriptions).map(async (responseStream) => {
		try {
			await responseStream(
				partialMessage,
				false, // Not the last message
			)
		} catch (error) {
			console.error("Error sending partial message event:", error)
			// Remove the subscription if there was an error
			activePartialMessageSubscriptions.delete(responseStream)
		}
	})

	await Promise.all(promises)
}
