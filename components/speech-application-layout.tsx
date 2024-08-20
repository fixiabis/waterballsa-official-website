import { useState } from "react";
import { ScheduleForm } from "./schedule-form";
import {
	SpeechApplicationForm,
	SpeechApplicationFormValues as SpeechApplicationFormValuesWithoutTime,
	useSpeechApplicationForm,
} from "./speech-application-form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerOverlay, DrawerTitle } from "./ui/drawer";
import { Textarea } from "./ui/textarea";

export interface SpeechApplicationFormValues extends SpeechApplicationFormValuesWithoutTime {
	eventStartTime: number;
	durationInMins: number;
}

export interface SpeechApplicationLayoutProps {
	title: string;
	description: string;
	speakerName: string;
	speakerEmail: string;
	speakerDiscordId: string;
	onSubmit: (values: SpeechApplicationFormValues) => void;
}

export default function SpeechApplicationLayout(props: SpeechApplicationLayoutProps) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const form = useSpeechApplicationForm({
		speakerName: props.speakerName,
		speakerDiscordId: props.speakerDiscordId,
		title: props.title,
		description: props.description,
	});

	const [submittedFormValues, setSubmittedFormValues] = useState<SpeechApplicationFormValuesWithoutTime | null>(null);

	if (submittedFormValues) {
		return (
			<main className="h-screen pt-12 px-4 flex flex-col items-center">
				<h1 className="text-2xl mb-8 font-bold">請選取上菜的時間</h1>
				<ScheduleForm
					speakerName={submittedFormValues.speakerName}
					speakerEmail={props.speakerEmail}
					onBookingSuccessful={(result) => {
						props.onSubmit({ ...submittedFormValues, ...result });
					}}
				/>
			</main>
		);
	}

	return (
		<main className="h-screen pt-12 px-4 flex flex-col items-center">
			<h1 className="text-2xl mb-8 font-bold">上菜申請</h1>
			<SpeechApplicationForm
				form={form}
				onSubmit={form.handleSubmit((values: SpeechApplicationFormValuesWithoutTime) => {
					setSubmittedFormValues(values);
				})}
				onDiscussDescription={() => setIsDrawerOpen(true)}
			/>
			<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
				<DrawerTitle className="invisible">聊聊你的上菜內容吧</DrawerTitle>
				<DrawerDescription></DrawerDescription>
				<DrawerContent className="bg-muted border-none h-screen md:h-auto rounded-lg w-full md:w-96 left-auto">
					<header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between shadow-sm rounded-t-lg">
						<div className="font-medium text-lg">聊聊你的上菜內容吧</div>
						<Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsDrawerOpen(false)}>
							<XIcon className="w-5 h-5" />
							<span className="sr-only">關閉</span>
						</Button>
					</header>
					<div className="flex-1 overflow-y-auto p-4 space-y-4 h-full md:max-h-72">
						<div className="flex items-start gap-4">
							<Avatar className="w-10 h-10">
								<AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
								<AvatarFallback>AI</AvatarFallback>
							</Avatar>
							<div className="grid gap-1">
								<div className="font-medium">John Doe</div>
								<div className="prose text-muted-foreground">
									<p>Hey everyone, how's it going?</p>
								</div>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<Avatar className="w-10 h-10">
								<AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
								<AvatarFallback>你</AvatarFallback>
							</Avatar>
							<div className="grid gap-1">
								<div className="font-medium">Sarah Adams</div>
								<div className="prose text-muted-foreground">
									<p>Doing great, thanks for asking!</p>
								</div>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<Avatar className="w-10 h-10">
								<AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
								<AvatarFallback>MC</AvatarFallback>
							</Avatar>
							<div className="grid gap-1">
								<div className="font-medium">Michael Chen</div>
								<div className="prose text-muted-foreground">
									<p>Hey guys, I have a question about the project.</p>
								</div>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<Avatar className="w-10 h-10">
								<AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
								<AvatarFallback>EW</AvatarFallback>
							</Avatar>
							<div className="grid gap-1">
								<div className="font-medium">Emily Wang</div>
								<div className="prose text-muted-foreground">
									<p>Sure, what's up?</p>
								</div>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<Avatar className="w-10 h-10">
								<AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
								<AvatarFallback>EW</AvatarFallback>
							</Avatar>
							<div className="grid gap-1">
								<div className="font-medium">Emily Wang</div>
								<div className="prose text-muted-foreground">
									<p>Sure, what's up?</p>
								</div>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<Avatar className="w-10 h-10">
								<AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
								<AvatarFallback>EW</AvatarFallback>
							</Avatar>
							<div className="grid gap-1">
								<div className="font-medium">Emily Wang</div>
								<div className="prose text-muted-foreground">
									<p>Sure, what's up?</p>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-background border-t py-2 px-4 flex items-center gap-2 rounded-b-lg">
						<Textarea
							placeholder="Type your message..."
							className="flex-1 resize-none rounded-md border border-input bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
						/>
						<Button type="submit" size="icon" className="rounded-full">
							<SendIcon className="w-5 h-5" />
							<span className="sr-only">Send</span>
						</Button>
					</div>
				</DrawerContent>
			</Drawer>
		</main>
	);
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="m22 2-7 20-4-9-9-4Z" />
			<path d="M22 2 11 13" />
		</svg>
	);
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	);
}
