import { ApplicationInput } from "@/lib/models/application";
import type { EventData } from "@calcom/embed-core/dist/src/sdk-action-manager";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef } from "react";

export interface ScheduleFormBookingResult {
	bookingId: string;
}

export interface ScheduleFormProps {
	applicationInput: ApplicationInput;
	onBookingSuccessful: (result: ScheduleFormBookingResult) => void;
}

export function ScheduleForm(props: ScheduleFormProps) {
	const calPromiseRef = useRef<ReturnType<typeof getCalApi> | null>(null);
	const handleBookedRef = useRef<(result: ScheduleFormBookingResult) => void>(() => {});

	handleBookedRef.current = props.onBookingSuccessful;

	useEffect(() => {
		calPromiseRef.current ??= getCalApi();

		const cleanCallbacks: (() => void)[] = [];

		calPromiseRef.current.then((cal) => {
			const handleBookingSuccessful: (e: CustomEvent<any>) => void = (
				e: CustomEvent<EventData<"bookingSuccessful">>
			) => {
				const bookingSuccessfulEventData = e.detail.data;

				handleBookedRef.current({
					bookingId: (bookingSuccessfulEventData.booking as any).uid,
				});
			};

			cal("ui", {
				theme: "light",
				// styles: { branding: { brandColor: "#1f04bc" } },
				hideEventTypeDetails: false,
				layout: "month_view",
			});

			cal("on", { action: "bookingSuccessful", callback: handleBookingSuccessful });

			cleanCallbacks.push(() => cal("off", { action: "bookingSuccessful", callback: handleBookingSuccessful }));
		});

		return () => cleanCallbacks.forEach((callback) => callback());
	}, []);

	return (
		<Cal
			calLink="waterballsa.tw/水球軟體學院-上菜"
			style={{ width: "100%", height: "100%", overflow: "scroll" }}
			config={{
				layout: "month_view",
				name: props.applicationInput.speakerName,
				email: props.applicationInput.speakerEmail,
				speakerDiscordId: props.applicationInput.speakerDiscordId,
				title: props.applicationInput.title,
				notes: props.applicationInput.description,
			}}
		/>
	);
}
