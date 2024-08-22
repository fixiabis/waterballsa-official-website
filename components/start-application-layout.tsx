import { ApplicationFields, Speaker } from "@/lib/speech/models/speech";
import { useState } from "react";
import { useSpeechApiGateway } from "./api-gateway-context";
import { LoadingLayout } from "./loading-layout";
import { StartApplicationForm } from "./start-application-form";

export interface StartApplicationLayoutProps {
	speaker: Speaker;
	onGeneratedApplicationFields: (applicationFields: ApplicationFields) => void;
}

export function StartApplicationLayout(props: StartApplicationLayoutProps) {
	const [isLoading, setIsLoading] = useState(false);
	const speechApiGateway = useSpeechApiGateway();

	if (isLoading) {
		return <LoadingLayout />;
	}

	return (
		<main className="h-screen flex flex-col items-center justify-center p-4">
			<StartApplicationForm
				speaker={props.speaker}
				onSubmit={async (values) => {
					setIsLoading(true);

					const applicationFields = await speechApiGateway.generateApplicationFields({
						abstract: values.abstract,
						speaker: props.speaker,
					});

					props.onGeneratedApplicationFields(applicationFields);
				}}
			/>
		</main>
	);
}
