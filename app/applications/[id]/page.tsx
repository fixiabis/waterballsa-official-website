"use client";
import { ApplicationResultLayout } from "@/components/application-result-layout";
import { LoadingLayout } from "@/components/loading-layout";
import { ScheduleResultView } from "@/components/schedule-result-view";
import { Application } from "@/lib/speech/models/speech";
import { useEffect, useState } from "react";

export interface ApplicationPageProps {
	params: { id: string };
}

export default function ApplicationPage(props: ApplicationPageProps) {
	const [layout, setLayout] = useState<React.ReactNode>(() => <LoadingLayout />);

	useEffect(() => {
		function renderApplicationResultLayout() {
			return <ApplicationResultLayout id={props.params.id} onCancel={() => setLayout(renderScheduleResultView())} />;
		}

		function renderScheduleResultView() {
			return (
				<main className="h-screen flex flex-col items-center pt-12 px-4">
					<h1 className="text-2xl mb-8 font-bold">上菜資訊</h1>
					<ScheduleResultView bookingId={props.params.id} />
				</main>
			);
		}

		setLayout(renderApplicationResultLayout());
	}, [props.params.id]);

	return layout;
}
