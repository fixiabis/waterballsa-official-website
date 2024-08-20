import { ApplicationResultView } from "@/components/application-result-view";
import { FakeSpeechApiGateway } from "@/lib/api-gateways/fake-speech-api-gateway";

export interface ApplicationPageProps {
	speechId: string;
}

export default async function ApplicationPage(props: ApplicationPageProps) {
	const { speechId } = props;
	// const speechApiGateway = new DefaultSpeechApiGateway(process.env.NEXT_PUBLIC_API_BASE_URL!);
	const speechApiGateway = new FakeSpeechApiGateway();
	const application = await speechApiGateway.getApplication(speechId);

	return (
		<main className="h-screen flex flex-col items-center pt-12 px-4">
			<h1 className="text-2xl mb-8 font-bold">上菜資訊</h1>
			<ApplicationResultView application={application} />
		</main>
	);
}
