import { GenerateApplicationDraftRequest, SpeechApiGateway, SubmitApplicationRequest } from "./speech-api-gateway";
import { ApplicationReviewStatus } from "../models/application";

export class FakeSpeechApiGateway implements SpeechApiGateway {
	async generateApplicationDraft(request: GenerateApplicationDraftRequest) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return { title: "標題".repeat(10), description: "描述".repeat(100), speakerName: "暱稱" };
	}

	async submitApplication(request: SubmitApplicationRequest) {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return {
			id: "0".repeat(32),
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

	async getApplication(id: string) {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return {
			id: id,
			title: "標題".repeat(10),
			description: "描述".repeat(100),
			speakerName: "暱稱",
			speakerDiscordId: "0".repeat(32),
			eventStartTime: new Date().getTime(),
			durationInMins: 30,
			applicationReviewStatus: "PENDING" as ApplicationReviewStatus,
		};
	}
}
