"use client";
import { useSpeechApiGateway } from "@/components/api-gateway-context";
import { ApplicationResultView } from "@/components/application-result-view";
import { CancelApplicationForm } from "@/components/cancel-application-form";
import LoadingLayout from "@/components/loading-layout";
import { Application } from "@/lib/models/application";
import { useEffect, useState } from "react";

export interface ApplicationPageProps {
	id: string;
}

export default function ApplicationPage(props: ApplicationPageProps) {
	const [layout, setLayout] = useState<React.ReactNode>(() => <LoadingLayout />);
	const speechApiGateway = useSpeechApiGateway();

	useEffect(() => {
		speechApiGateway
			.getApplication(props.id)
			.then((application) => setLayout(renderApplicationLayout({ changeLayout: setLayout, application })));
	}, [speechApiGateway, props.id]);

	return layout;
}

export function renderApplicationLayout({
	changeLayout,
	application,
}: {
	changeLayout: (layout: React.ReactNode) => void;
	application: Application;
}) {
	return (
		<main className="h-screen flex flex-col items-center pt-12 px-4">
			<h1 className="text-2xl mb-8 font-bold">上菜資訊</h1>
			<ApplicationResultView
				application={application}
				onCancel={() => changeLayout(renderCancelApplicationLayout({ changeLayout, application }))}
			/>
		</main>
	);
}

export function renderCancelApplicationLayout({
	changeLayout,
	application,
}: {
	changeLayout: (layout: React.ReactNode) => void;
	application: Application;
}) {
	return (
		<main className="h-screen flex flex-col items-center pt-12 px-4">
			<h1 className="text-2xl mb-8 font-bold">取消上菜</h1>
			<CancelApplicationForm
				onSubmit={console.log}
				onCancel={() => changeLayout(renderApplicationLayout({ changeLayout, application }))}
			/>
		</main>
	);
}
