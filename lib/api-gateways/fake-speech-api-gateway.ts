import {
	ApplicationReviewStatus,
	GenerateApplicationDraftRequest,
	SpeechApiGateway,
	SubmitApplicationRequest,
} from "./speech-api-gateway";

export class FakeSpeechApiGateway implements SpeechApiGateway {
	async generateApplicationDraft(request: GenerateApplicationDraftRequest) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return { title: "標題", description: "描述", speakerName: "暱稱" };
	}

	async submitApplication(request: SubmitApplicationRequest) {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return {
			speechId: "0".repeat(32),
			title: request.title,
			description: request.description,
			speakerName: request.speakerName,
			speakerDiscordId: request.speakerDiscordId,
			eventStartTime: request.eventStartTime,
			durationInMins: request.durationInMins,
			applicationReviewStatus: "PENDING" as ApplicationReviewStatus,
		};
	}

	async generateApplicationDescription() {}

	async getApplication(speechId: string) {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return {
			speechId: "0".repeat(32),
			title: "標題",
			description: "描述",
			speakerName: "暱稱",
			speakerDiscordId: "0".repeat(32),
			eventStartTime: new Date().getTime(),
			durationInMins: 30,
			applicationReviewStatus: "PENDING" as ApplicationReviewStatus,
		};
	}
}
