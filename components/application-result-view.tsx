import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Application, ApplicationReviewStatus } from "@/lib/models/application";
import { formatTime } from "@/lib/utils";

export interface ApplicationResultViewProps {
	application: Application;
	onCancel: () => void;
}

const applicationReviewStatusToText: { [key in ApplicationReviewStatus]: string } = {
	[ApplicationReviewStatus.PENDING]: "待審查",
	[ApplicationReviewStatus.PASSED]: "已通過",
	[ApplicationReviewStatus.DENIED]: "已拒絕",
};

export function ApplicationResultView(props: ApplicationResultViewProps) {
	const { application, onCancel } = props;

	return (
		<Card className="w-full max-w-md lg:max-w-xl p-6 grid gap-6">
			<div className="grid gap-2">
				<div className="text-sm text-muted-foreground">{application.speakerName}</div>
				<h2 className="text-2xl font-bold">{application.title}</h2>
				<p className="text-muted-foreground">{application.description}</p>
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<CalendarIcon className="w-4 h-4" />
						<span>{formatTime(new Date(application.eventStartTime))}</span>
					</div>
					<div className="flex items-center gap-2">
						<ClockIcon className="w-4 h-4" />
						<span>{application.durationInMins} 分鐘</span>
					</div>
					<div className="flex items-center gap-2">
						<ClipboardIcon className="w-4 h-4" />
						<span>{applicationReviewStatusToText[application.applicationReviewStatus]}</span>
					</div>
				</div>
			</div>
			{/* TODO: 之後支援取消 */}
			{/* <div className="flex justify-end gap-2">
				<Button
					variant="destructive"
					onClick={onCancel}
					disabled={application.applicationReviewStatus === ApplicationReviewStatus.DENIED}
				>
					取消上菜
				</Button>
			</div> */}
		</Card>
	);
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M8 2v4" />
			<path d="M16 2v4" />
			<rect width="18" height="18" x="3" y="4" rx="2" />
			<path d="M3 10h18" />
		</svg>
	);
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	);
}

function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
			<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
		</svg>
	);
}
