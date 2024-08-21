import { Application, ApplicationDraft } from "../models/application";

export interface SpeechApiGateway {
	generateApplicationDraft(request: GenerateApplicationDraftRequest): Promise<ApplicationDraft>;

	submitApplication(request: SubmitApplicationRequest): Promise<Application>;

	startDiscussionAboutSpeechDescription(): Promise<string>;

	sendMessageToDiscussSpeechDescription(
		discussionId: string,
		message: string,
		onUpdateMessage: (message: string) => void,
		onUpdateDescription: (description: string) => void
	): Promise<void>;

	getApplication(speechId: string): Promise<Application>;
}

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
