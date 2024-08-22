import { Application, ApplicationInput, ApplicationInputDraft, DiscussionMessage } from "../models/application";

export interface SpeechApiGateway {
	generateApplicationInputDraft(request: GenerateApplicationDraftRequest): Promise<ApplicationInputDraft>;

	startDiscussionAboutSpeechDescription(
		draft: ApplicationInput,
		onUpdateMessage: (message: string) => void
	): Promise<DiscussionId>;

	sendMessageToDiscussSpeechDescription(
		discussionId: DiscussionId,
		message: string,
		onUpdateMessage: (message: string) => void,
		onUpdateDescription: (description: string) => void
	): Promise<void>;

	getApplication(speechId: string): Promise<Application>;

	generateSpeechDescription(messages: DiscussionMessage[]): Promise<string>;
}

export type DiscussionId = string;

export interface GenerateApplicationDraftRequest {
	abstract: string;
	speakerDiscordId: string;
}

export interface SubmitApplicationRequest {
	title: string;
	description: string;
	speakerName: string;
	speakerDiscordId: string;
	eventStartTime: number;
	durationInMins: number;
}
