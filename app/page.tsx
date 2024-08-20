"use client";

import { useSpeechApiGateway } from "@/components/api-gateway-context";
import { LoadingSpinner } from "@/components/loading-spinner";
import SpeechApplicationLayout from "@/components/speech-application-layout";
import { StartApplicationForm } from "@/components/start-application-form";
import { ApplicationDraft, SpeechApiGateway } from "@/lib/api-gateways/speech-api-gateway";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AppRouterInstance = ReturnType<typeof useRouter>;

type ExternalAccountResource = Exclude<
	ReturnType<typeof useUser>["user"],
	null | undefined
>["externalAccounts"][number];

export default function Home() {
	const { isLoaded, user } = useUser();
	const router = useRouter();
	const [layout, setLayout] = useState<React.ReactNode>(renderLoadingLayout);
	const speechApiGateway = useSpeechApiGateway();

	useEffect(() => {
		if (isLoaded) {
			const discordAccount = user!.externalAccounts.find((account) => account.provider === "discord")!;
			setLayout(renderStartApplicationLayout({ changeLayout: setLayout, router, speechApiGateway, discordAccount }));
		}
	}, [isLoaded]);

	return layout;
}

export function renderLoadingLayout() {
	return (
		<main className="h-screen flex flex-col items-center justify-center">
			<LoadingSpinner />
		</main>
	);
}

export function renderStartApplicationLayout(props: {
	changeLayout: (layout: React.ReactNode) => void;
	router: AppRouterInstance;
	speechApiGateway: SpeechApiGateway;
	discordAccount: ExternalAccountResource;
}) {
	const { changeLayout, speechApiGateway, discordAccount } = props;
	const discordUserUsername = discordAccount.username;
	const discordUserId = discordAccount.providerUserId;
	const discordUserImageUrl = discordAccount.imageUrl;

	return (
		<main className="h-screen flex flex-col items-center justify-center p-4">
			<StartApplicationForm
				userId={discordUserId || ""}
				userUsername={discordUserUsername || ""}
				userImageUrl={discordUserImageUrl || ""}
				onSubmit={async (values) => {
					changeLayout(renderLoadingLayout());

					const applicationDraft = await speechApiGateway.generateApplicationDraft({
						abstract: values.abstract,
						speakerDiscordId: discordUserId,
					});

					changeLayout(renderSpeechApplicationLayout({ ...props, applicationDraft }));
				}}
			/>
		</main>
	);
}

export function renderSpeechApplicationLayout(props: {
	changeLayout: (layout: React.ReactNode) => void;
	router: AppRouterInstance;
	speechApiGateway: SpeechApiGateway;
	discordAccount: ExternalAccountResource;
	applicationDraft: ApplicationDraft;
}) {
	const { changeLayout, speechApiGateway, discordAccount, applicationDraft, router } = props;
	const discordUserId = discordAccount.providerUserId;
	const discordUserEmail = discordAccount.emailAddress;

	return (
		<SpeechApplicationLayout
			title={applicationDraft.title}
			description={applicationDraft.description}
			speakerName={applicationDraft.speakerName}
			speakerDiscordId={discordUserId}
			speakerEmail={discordUserEmail}
			onSubmit={async (values) => {
				changeLayout(renderLoadingLayout());

				const data = await speechApiGateway.submitApplication({
					title: values.title,
					description: values.description,
					speakerName: applicationDraft.speakerName,
					speakerDiscordId: discordUserId,
					eventStartTime: new Date().getTime(),
					durationInMins: 30,
				});

				router.push(`/applications/${data.speechId}`);
			}}
		/>
	);
}
