import { GenerateApplicationDraftRequest, SpeechApiGateway, SubmitApplicationRequest } from "./speech-api-gateway";
import { Application, DiscussionMessage } from "../models/application";

export class DefaultSpeechApiGateway implements SpeechApiGateway {
	private readonly baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	public async generateApplicationInputDraft(request: GenerateApplicationDraftRequest) {
		const query = new URLSearchParams({
			abstract: request.abstract,
			speaker_discord_id: request.speakerDiscordId,
		});

		const response = await fetch(`${this.baseUrl}/speeches/applications?${query}`);
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

		const response = await fetch(`${this.baseUrl}/speeches/applications`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: requestBody,
		});

		const responseData = await response.json();

		return {
			id: responseData.speech_id,
			title: responseData.title,
			description: responseData.description,
			speakerName: responseData.speaker_name,
			speakerDiscordId: responseData.speaker_discord_id,
			eventStartTime: responseData.event_start_time * 1000,
			durationInMins: responseData.duration_in_mins,
			applicationReviewStatus: responseData.application_review_status,
		};
	}

	startDiscussionAboutSpeechDescription(): Promise<string> {
		throw new Error("Method not implemented.");
	}

	sendMessageToDiscussSpeechDescription(
		discussionId: string,
		message: string,
		onUpdateMessage: (message: string) => void,
		onUpdateDescription: (description: string) => void
	): Promise<void> {
		throw new Error("Method not implemented.");
	}

	generateSpeechDescription(messages: DiscussionMessage[]): Promise<string> {
		throw new Error("Method not implemented.");
	}

	public async getApplication(id: string): Promise<Application> {
		const response = await fetch(`${this.baseUrl}/speeches/applications/${id}`);
		const responseData = await response.json();

		return {
			id: responseData.speech_id,
			title: responseData.title,
			description: responseData.description,
			speakerName: responseData.speaker_name,
			speakerDiscordId: responseData.speaker_discord_id,
			eventStartTime: responseData.event_start_time * 1000,
			durationInMins: responseData.duration_in_mins,
			applicationReviewStatus: responseData.application_review_status,
		};
	}
}
