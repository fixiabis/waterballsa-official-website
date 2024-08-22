import { Application, ApplicationFields, DiscussionMessage, Speaker } from "../models/speech";

export interface SpeechApiGateway {
	generateApplicationFields(request: GenerateApplicationFieldsRequest): Promise<ApplicationFields>;

	startDiscussionAboutSpeechDescription(
		applicationFields: ApplicationFields,
		onUpdateMessage: (message: string) => void
	): Promise<DiscussionId>;

	sendMessageToDiscussSpeechDescription(
		discussionId: DiscussionId,
		message: string,
		onUpdateMessage: (message: string) => void,
		onUpdateDescription: (description: string) => void
	): Promise<void>;

	generateSpeechDescription(messages: DiscussionMessage[]): Promise<string>;

	getApplication(id: string): Promise<Application>;
}

export type DiscussionId = string;

export interface GenerateApplicationFieldsRequest {
	abstract: string;
	speaker: Speaker;
}
