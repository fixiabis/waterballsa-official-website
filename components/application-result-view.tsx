import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Application } from "@/lib/models/application";
import { formatTime } from "@/lib/utils";

export function ApplicationResultView(props: { application: Application }) {
	const { application } = props;

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
				</div>
			</div>
			<div className="flex justify-end gap-2">
				<Button variant="outline">取消</Button>
			</div>
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
