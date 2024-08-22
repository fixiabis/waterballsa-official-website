"use client";

import { useSpeechApiGateway } from "@/components/api-gateway-context";
import LoadingLayout from "@/components/loading-layout";
import SpeechApplicationLayout from "@/components/speech-application-layout";
import { StartApplicationForm } from "@/components/start-application-form";
import { SpeechApiGateway } from "@/lib/api-gateways/speech-api-gateway";
import { ApplicationDraft } from "@/lib/models/application";
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
	const [layout, setLayout] = useState<React.ReactNode>(() => <LoadingLayout />);
	const speechApiGateway = useSpeechApiGateway();

	useEffect(() => {
		if (isLoaded) {
			const discordAccount = user!.externalAccounts.find((account) => account.provider === "discord")!;
			setLayout(renderStartApplicationLayout({ changeLayout: setLayout, router, speechApiGateway, discordAccount }));
		}
	}, [isLoaded, router, speechApiGateway, user]);

	return layout;
}

function renderStartApplicationLayout(props: {
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
					changeLayout(<LoadingLayout />);

					const applicationDraft = await speechApiGateway.generateApplicationDraft({
						abstract: values.abstract,
						speakerDiscordId: discordUserId,
					});

					applicationDraft.speakerName ||= discordUserUsername || "";

					changeLayout(renderApplicationFormLayout({ ...props, applicationDraft }));
				}}
			/>
		</main>
	);
}

function renderApplicationFormLayout(props: {
	changeLayout: (layout: React.ReactNode) => void;
	router: AppRouterInstance;
	speechApiGateway: SpeechApiGateway;
	discordAccount: ExternalAccountResource;
	applicationDraft: ApplicationDraft;
}) {
	const { changeLayout, speechApiGateway, discordAccount, applicationDraft, router } = props;
	const discordUserId = discordAccount.providerUserId;
	const discordUserImageUrl = discordAccount.imageUrl;
	const discordUserEmail = discordAccount.emailAddress;

	return (
		<SpeechApplicationLayout
			title={applicationDraft.title}
			description={applicationDraft.description}
			speakerName={applicationDraft.speakerName}
			speakerImageUrl={discordUserImageUrl}
			speakerDiscordId={discordUserId}
			speakerEmail={discordUserEmail}
			onSubmit={async (id) => {
				router.push(`/applications/${id}`);
			}}
		/>
	);
}
