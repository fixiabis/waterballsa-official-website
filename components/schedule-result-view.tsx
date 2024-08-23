import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef } from "react";

export interface ScheduleResultViewProps {
	bookingId: string;
}

export function ScheduleResultView(props: ScheduleResultViewProps) {
	const calPromiseRef = useRef<ReturnType<typeof getCalApi> | null>(null);

	useEffect(() => {
		calPromiseRef.current ??= getCalApi();

		calPromiseRef.current.then((cal) => {
			cal("ui", {
				theme: "light",
				hideEventTypeDetails: false,
				layout: "month_view",
			});
		});
	}, []);

	return (
		<Cal
			calLink={`booking/${props.bookingId}`}
			style={{ width: "100%", height: "100%", overflow: "scroll" }}
			config={{ layout: "month_view", cancel: "true" }}
		/>
	);
}
