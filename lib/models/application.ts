export interface ApplicationInputDraft {
	title: string;
	description: string;
	speakerName: string;
}

export interface ApplicationInput {
	title: string;
	description: string;
	speakerName: string;
	speakerEmail: string;
	speakerDiscordId: string;
}

export interface Application {
	id: string;
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

export interface DiscussionMessage {
	authorName: string;
	message: string;
}
