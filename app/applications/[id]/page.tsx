"use client";
import { ScheduleResultView } from "@/components/schedule-result-view";

export interface ApplicationPageProps {
	params: { id: string };
}

export default function ApplicationPage(props: ApplicationPageProps) {
	return (
		<main className="h-screen flex flex-col items-center pt-12 px-4">
			<h1 className="text-2xl mb-8 font-bold">上菜資訊</h1>
			<ScheduleResultView bookingId={props.params.id} />
		</main>
	);
}
