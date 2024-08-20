import {
    GenerateApplicationDraftRequest,
    SubmitApplicationRequest
} from "./speech-api-gateway";

export class DefaultSpeechApiGateway {
	private readonly baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	public async generateApplicationDraft(request: GenerateApplicationDraftRequest) {
		const query = new URLSearchParams({
			abstract: request.abstract,
			speaker_discord_id: request.speakerDiscordId,
		});

		const response = await fetch(`${this.baseUrl}/api/speeches/applications?${query}`);
		const responseData = await response.json();

		return {
			title: responseData.title,
			description: responseData.description,
			speakerName: responseData.speaker_name,
		};
	}

	public async submitApplication(request: SubmitApplicationRequest) {
		const requestBody = JSON.stringify({
			title: request.title,
			description: request.description,
			speaker_name: request.speakerName,
			speaker_discord_id: request.speakerDiscordId,
			event_start_time: request.eventStartTime,
			duration_in_mins: request.durationInMins,
		});

		const response = await fetch(`${this.baseUrl}/api/speeches/applications`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: requestBody,
		});

		const responseData = await response.json();

		return {
			speechId: responseData.speech_id,
			title: responseData.title,
			description: responseData.description,
			speakerName: responseData.speaker_name,
			speakerDiscordId: responseData.speaker_discord_id,
			eventStartTime: responseData.event_start_time,
			durationInMins: responseData.duration_in_mins,
			applicationReviewStatus: responseData.application_review_status,
		};
	}

	public async generateApplicationDescription() {}
}
