export class VoiceTranscriptionService {
	async transcribeAudio(_audioBase64: string, _language?: string): Promise<{ text?: string; error?: string }> {
		return {
			error: "Voice transcription requires the legacy Clica account proxy, which has been removed. Please configure an alternative transcription provider if available.",
		}
	}
}

// Lazily construct the service to avoid circular import initialization issues
let _voiceTranscriptionServiceInstance: VoiceTranscriptionService | null = null
export function getVoiceTranscriptionService(): VoiceTranscriptionService {
	if (!_voiceTranscriptionServiceInstance) {
		_voiceTranscriptionServiceInstance = new VoiceTranscriptionService()
	}
	return _voiceTranscriptionServiceInstance
}
