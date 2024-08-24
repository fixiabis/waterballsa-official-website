import { GenerateApplicationFieldsRequest, GenerateSpeechDescriptionRequest, SpeechApiGateway } from "./speech-api-gateway";
import { ApplicationFields, ApplicationReviewStatus, DiscussionMessage } from "../models/speech";

export class FakeSpeechApiGateway implements SpeechApiGateway {
	async generateApplicationFields(request: GenerateApplicationFieldsRequest) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return {
			title: request.abstract,
			description: `關於${request.abstract}，我想分享一些我的經驗`,
			speakerName: request.speaker.username,
			speakerEmail: request.speaker.email,
			speakerDiscordId: request.speaker.discordId,
		};
	}

	async startDiscussionAboutSpeechDescription(fields: ApplicationFields, onUpdateMessage: (message: string) => void) {
		const finalMessageChunks = "請問有什麼想要補充的嗎？".split("");

		let finalMessage = "";

		for (const messageChunk of finalMessageChunks) {
			await new Promise((resolve) => setTimeout(resolve, 1000 / finalMessageChunks.length));
			finalMessage += messageChunk;
			onUpdateMessage(finalMessage);
		}

		return "0".repeat(32);
	}

	async sendMessageToDiscussSpeechDescription(
		discussionId: string,
		message: string,
		onUpdateMessage: (message: string) => void,
		onUpdateDescription: (description: string) => void
	): Promise<void> {
		const willDescriptionUpdated = message.length >= 10;
		const finalMessageChunks = willDescriptionUpdated
			? "感謝你的分享！已更新了一版活動文宣，在排定活動時間後可以再修改標題和描述喔！"
			: `好的，關於你提到的 "${message}" 的部分我會想辦法整理到文宣當中，還有什麼想要補充的嗎？`.split("");

		let finalMessage = "";

		for (const messageChunk of finalMessageChunks) {
			await new Promise((resolve) => setTimeout(resolve, 10 / finalMessageChunks.length));
			finalMessage += messageChunk;
			onUpdateMessage(finalMessage);
		}

		if (willDescriptionUpdated) {
			onUpdateDescription("這是討論後生成的描述");
		}
	}

	async generateSpeechDescription(request: GenerateSpeechDescriptionRequest): Promise<string> {
		await new Promise((resolve) => setTimeout(resolve, request.discussionMessages.length * 100));
		return "這是生成的描述";
	}

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
			canceled: false,
		};
	}
}
