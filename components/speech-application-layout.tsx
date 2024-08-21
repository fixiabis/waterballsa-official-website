import { useEffect, useRef, useState } from "react";
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
import { useSpeechApiGateway } from "./api-gateway-context";
import { Card } from "./ui/card";

export interface SpeechApplicationFormValues extends SpeechApplicationFormValuesWithoutTime {
	eventStartTime: number;
	durationInMins: number;
}

export interface SpeechApplicationLayoutProps {
	title: string;
	description: string;
	speakerName: string;
	speakerEmail: string;
	speakerImageUrl: string;
	speakerDiscordId: string;
	onSubmit: (values: SpeechApplicationFormValues) => void;
}

interface Message {
	authorName: string;
	authorImageUrl: string;
	message: string;
	typing?: boolean;
}

export default function SpeechApplicationLayout(props: SpeechApplicationLayoutProps) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(true);
	const [discussionId, setDiscussionId] = useState<string | null>(null);
	const speechApiGateway = useSpeechApiGateway();

	const form = useSpeechApplicationForm({
		speakerName: props.speakerName,
		speakerDiscordId: props.speakerDiscordId,
		title: props.title,
		description: props.description,
	});

	const [submittedFormValues, setSubmittedFormValues] = useState<SpeechApplicationFormValuesWithoutTime | null>(null);

	const [discussionMessages, setDiscussionMessages] = useState<Message[]>([
		{
			authorName: "AI",
			authorImageUrl: "/placeholder-user.jpg",
			message: "你好！請問有什麼我可以幫助你的嗎？你想要討論關於演講的哪個方面呢？",
		},
	]);

	const lastDiscussionMessage = discussionMessages[discussionMessages.length - 1];

	const [message, setMessage] = useState("");

	const messageScrollAreaRef = useRef<HTMLDivElement>(null);

	const sendMessage = async (userMessage: string) => {
		if (discussionId === null || !userMessage.trim()) {
			return;
		}

		setDiscussionMessages((messages) => [
			...messages,
			{ authorName: "你", authorImageUrl: props.speakerImageUrl, message: userMessage },
		]);

		setMessage("");

		const onUpdateMessage = (aiMessage: string) => {
			setDiscussionMessages((messages) => {
				messages = [...messages];
				const lastMessage = messages[messages.length - 1];

				if (lastMessage.authorName !== "AI") {
					messages = [
						...messages,
						{ authorName: "AI", authorImageUrl: "/placeholder-user.jpg", message: aiMessage, typing: true },
					];
				}

				if (lastMessage.authorName === "AI") {
					messages[messages.length - 1] = { ...lastMessage, message: aiMessage, typing: true };
				}

				return messages;
			});
		};

		const onUpdateDescription = (description: string) => {
			form.setValue("description", description);
		};

		await speechApiGateway.sendMessageToDiscussSpeechDescription(
			discussionId,
			userMessage,
			onUpdateMessage,
			onUpdateDescription
		);

		setDiscussionMessages((messages) => {
			messages = [...messages];
			const lastMessage = messages[messages.length - 1];

			if (lastMessage.authorName === "AI") {
				messages[messages.length - 1] = { ...lastMessage, typing: false };
			}

			return messages;
		});
	};

	useEffect(() => {
		messageScrollAreaRef.current?.scrollTo({ top: messageScrollAreaRef.current.scrollHeight, behavior: "smooth" });
	}, [discussionMessages]);

	useEffect(() => {
		if (!isDrawerOpen || discussionId !== null) {
			return;
		}

		speechApiGateway.startDiscussionAboutSpeechDescription().then((discussionId) => {
			setDiscussionId(discussionId);
		});
	}, [speechApiGateway, isDrawerOpen, discussionId]);

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

	const isAiResponded =
		discussionId !== null && lastDiscussionMessage.authorName === "AI" && !lastDiscussionMessage.typing;

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
				<DrawerContent className="bg-muted border-none shadow-lg h-screen _md:h-auto rounded-lg w-full _md:w-96 left-auto">
					<header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between shadow-sm">
						<div className="font-medium text-lg">聊聊你的上菜內容吧</div>
						<Button variant="ghost" onClick={() => setIsDrawerOpen(false)}>
							生成活動文宣
							{/* <XIcon className="w-5 h-5" />
							<span className="sr-only">關閉</span> */}
						</Button>
					</header>
					<div
						className="flex-1 overflow-y-auto p-4 space-y-4 h-full _md:min-h-80 _md:max-h-80"
						ref={messageScrollAreaRef}
					>
						{/* 顯示目前產生的活動 */}
						{discussionMessages.map((message, index) => (
							<div key={index} className="flex items-start gap-4">
								<Avatar className="w-10 h-10">
									<AvatarImage src={message.authorImageUrl} alt={message.authorName} />
									<AvatarFallback>{message.authorName}</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<div className="font-medium">{message.authorName}</div>
									<div className="prose text-muted-foreground">
										<p>{message.message}</p>
										{index === 0 && (
											<p className="py-2">
												<Card className="w-full max-w-md lg:max-w-xl p-6 grid gap-6 bg-primary text-primary-foreground">
													<div className="grid gap-2">
														<h2 className="text-2xl font-bold">{props.title}</h2>
														<p className="text-primary-foreground">{props.description}</p>
													</div>
												</Card>
											</p>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="bg-background border-t py-2 px-4 flex items-center gap-2 rounded-b-lg">
						<Textarea
							placeholder="Type your message..."
							className="flex-1 resize-none rounded-md border border-input bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
							onChange={(event) => setMessage(event.target.value)}
							value={message}
							onKeyDown={(event) => {
								if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
									return;
								}

								event.preventDefault();

								if (!isAiResponded) {
									return;
								}

								sendMessage(message);
							}}
						/>
						<Button
							type="button"
							size="icon"
							className="rounded-full"
							onClick={() => {
								sendMessage(message);
							}}
							disabled={!isAiResponded || !message.trim()}
						>
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
