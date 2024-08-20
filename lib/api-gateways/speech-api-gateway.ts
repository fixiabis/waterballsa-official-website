export interface SpeechApiGateway {
	generateApplicationDraft(request: GenerateApplicationDraftRequest): Promise<ApplicationDraft>;

	submitApplication(request: SubmitApplicationRequest): Promise<Application>;

	generateApplicationDescription(): Promise<void>;

	getApplication(speechId: string): Promise<Application>;
}

export interface GenerateApplicationDraftRequest {
	abstract: string;
	speakerDiscordId: string;
}

export interface ApplicationDraft {
	title: string;
	description: string;
	speakerName: string;
}

export interface SubmitApplicationRequest {
	title: string;
	description: string;
	speakerName: string;
	speakerDiscordId: string;
	eventStartTime: number;
	durationInMins: number;
}

export interface Application {
	speechId: string;
	title: string;
	description: string;
	speakerName: string;
	speakerDiscordId: string;
	eventStartTime: number;
	durationInMins: number;
	applicationReviewStatus: ApplicationReviewStatus;
}

export const enum ApplicationReviewStatus {
	PENDING = "PENDING",
	PASSED = "PASSED",
	DENIED = "DENIED",
}
