"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingLayout } from "../components/loading-layout";
import { SpeechDiscussionLayout } from "../components/speech-discussion-layout";
import { useSpeechSpeaker } from "../components/use-speech-speaker";
import { ApplicationFields, Speaker } from "../lib/speech/models/speech";
import { StartApplicationLayout } from "@/components/start-application-layout";

export default function Home() {
	const { isLoaded, speaker } = useSpeechSpeaker();
	const router = useRouter();
	const [layout, setLayout] = useState<React.ReactNode>(() => <LoadingLayout />);

	useEffect(() => {
		function renderStartApplicationLayout(speaker: Speaker) {
			return (
				<StartApplicationLayout
					speaker={speaker}
					onGeneratedApplicationFields={(applicationFields) => {
						setLayout(renderSpeechDiscussionLayout(speaker, applicationFields));
					}}
				/>
			);
		}

		function renderSpeechDiscussionLayout(speaker: Speaker, applicationFields: ApplicationFields) {
			return (
				<SpeechDiscussionLayout
					applicationFields={applicationFields}
					userImageUrl={speaker.imageUrl}
					onApplied={async (id) => {
						router.push(`/applications/${id}`);
					}}
				/>
			);
		}

		if (isLoaded && speaker) {
			setLayout(renderStartApplicationLayout(speaker));
		}
	}, [isLoaded, router, speaker]);

	return layout;
}
