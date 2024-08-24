import { v4 as uuidv4 } from "uuid";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
	GenerateApplicationFieldsRequest,
	GenerateSpeechDescriptionRequest,
	SpeechApiGateway,
} from "./speech-api-gateway";
import { Application, ApplicationFields } from "../models/speech";

export class DefaultSpeechApiGateway implements SpeechApiGateway {
	private readonly baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	public async generateApplicationFields(request: GenerateApplicationFieldsRequest) {
		const query = new URLSearchParams({
			abstract: request.abstract,
			speaker_discord_id: request.speaker.discordId,
		});

		const response = await fetch(`${this.baseUrl}/speeches/applications?${query}`);
		const responseData = await response.json();

		return {
			title: responseData["title"],
			description: responseData["description"],
			speakerName: responseData["speaker_name"],
			speakerEmail: request.speaker.email,
			speakerDiscordId: request.speaker.discordId,
		};
	}

	public async startDiscussionAboutSpeechDescription(
		applicationFields: ApplicationFields,
		onUpdateMessage: (message: string) => void,
		onUpdateDescription: (description: string) => void
	): Promise<string> {
		const discussionId = uuidv4();

		await this.sendMessageToDiscussSpeechDescription(
			discussionId,
			"我要介紹的是「" + applicationFields.title + "」，" + applicationFields.description,
			onUpdateMessage,
			onUpdateDescription
		);

		return discussionId;
	}

	public async sendMessageToDiscussSpeechDescription(
		discussionId: string,
		message: string,
		onUpdateMessage: (message: string) => void,
		onUpdateDescription: (description: string) => void
	): Promise<void> {
		let finalMessage = "";
		let isDescriptionUpdated = false;

		await fetchEventSource(`${this.baseUrl}/speeching/stream_log`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				input: message,
				config: {
					configurable: {
						thread_id: discussionId,
						critique_model: "openai",
						draft_model: "openai",
						gather_model: "openai",
					},
				},
			}),
			async onmessage(e) {
				if (!e.data.trim()) {
					return;
				}

				const data = JSON.parse(e.data);

				if (!("ops" in data)) {
					return;
				}

				const ops = data["ops"] as any[];

				for (const op of ops) {
					if (op["op"] === "add" && op["path"] === "/logs/ChatOpenAI/streamed_output_str/-") {
						const message = op["value"];
						finalMessage += message;
						onUpdateMessage(finalMessage);
					}

					if (op["op"] === "add" && op["path"] === "/logs/draft_answer/final_output") {
						const description = op["value"]["messages"][0]["content"];
						onUpdateDescription(description);
						isDescriptionUpdated = true;
					}
				}
			},
		});

		if (isDescriptionUpdated) {
			const finalMessageChunks = "感謝你的分享！已更新了一版活動文宣，在排定活動時間後可以再修改標題和描述喔！";

			for (const messageChunk of finalMessageChunks) {
				await new Promise((resolve) => setTimeout(resolve, 10 / finalMessageChunks.length));
				finalMessage += messageChunk;
				onUpdateMessage(finalMessage);
			}
		}
	}

	public async generateSpeechDescription(request: GenerateSpeechDescriptionRequest): Promise<string> {
		const applicationFields = await this.generateApplicationFields({
			abstract: request.discussionMessages
				.filter((message) => message.authorName !== "AI")
				.map((message) => message.content)
				.join("\n"),
			speaker: request.speaker,
		});

		return applicationFields.description;
	}

	public async getApplication(id: string): Promise<Application> {
		const response = await fetch(`${this.baseUrl}/speeches/applications/${id}`);
		const responseData = await response.json();

		return {
			id: responseData["speech_id"],
			title: responseData["title"],
			description: responseData["description"],
			speakerName: responseData["speaker_name"],
			speakerDiscordId: responseData["speaker_discord_id"],
			eventStartTime: responseData["event_start_time"] * 1000,
			durationInMins: responseData["duration_in_mins"],
			applicationReviewStatus: responseData["application_review_status"],
			canceled: false,
		};
	}
}
