export interface Speaker {
	username: string;
	email: string;
	discordId: string;
	imageUrl: string;
}

export interface ApplicationFields {
	title: string;
	description: string;
	speakerName: string;
	speakerDiscordId: string;
	speakerEmail: string;
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
	canceled: boolean;
}

export const enum ApplicationReviewStatus {
	PENDING = "PENDING",
	PASSED = "PASSED",
	DENIED = "DENIED",
}

export interface DiscussionMessage {
	authorName: string;
	content: string;
}
