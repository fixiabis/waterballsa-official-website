import { Application } from "@/lib/speech/models/speech";
import { useEffect, useState } from "react";
import { LoadingLayout } from "./loading-layout";
import { ApplicationResultView } from "./application-result-view";
import { useSpeechApiGateway } from "./api-gateway-context";

export interface ApplicationResultLayoutProps {
	id: string;
	onCancel: () => void;
}

export function ApplicationResultLayout(props: ApplicationResultLayoutProps) {
	const speechApiGateway = useSpeechApiGateway();
	const [application, setApplication] = useState<Application | null>(null);

	useEffect(() => {
		speechApiGateway.getApplication(props.id).then((application) => setApplication(application));
	}, [speechApiGateway, props.id]);

	if (!application) {
		return <LoadingLayout />;
	}

	return (
		<main className="h-screen flex flex-col items-center pt-12 px-4">
			<h1 className="text-2xl mb-8 font-bold">上菜資訊</h1>
			<ApplicationResultView application={application} onCancel={props.onCancel} />
		</main>
	);
}
