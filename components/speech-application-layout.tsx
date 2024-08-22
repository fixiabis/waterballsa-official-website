import React, { useEffect, useRef, useState } from "react";
import { ScheduleForm } from "./schedule-form";
import {
	SpeechApplicationFormValues as SpeechApplicationFormValuesWithoutTime,
	useSpeechApplicationForm,
} from "./speech-application-form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useSpeechApiGateway } from "./api-gateway-context";
import { Card } from "./ui/card";
import { DiscussionMessage } from "@/lib/models/application";
import { LoadingSpinner } from "./loading-spinner";

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
	onSubmit: (id: string) => void;
}

interface Message extends DiscussionMessage {
	authorName: string;
	authorImageUrl: string;
	message: string;
	typing?: boolean;
}

export default function SpeechApplicationLayout(props: SpeechApplicationLayoutProps) {
	const [discussionId, setDiscussionId] = useState<string | null>(null);
	const speechApiGateway = useSpeechApiGateway();

	const form = useSpeechApplicationForm({
		speakerName: props.speakerName,
		speakerDiscordId: props.speakerDiscordId,
		title: props.title,
		description: props.description,
	});

	const [submittedFormValues, setSubmittedFormValues] = useState<SpeechApplicationFormValuesWithoutTime | null>(null);
	const [isDescriptionUpdated, setIsDescriptionUpdated] = useState(false);
	const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

	const [discussionMessages, setDiscussionMessages] = useState<Message[]>([]);

	const lastDiscussionMessage = discussionMessages[discussionMessages.length - 1] || null;

	const [message, setMessage] = useState("");

	const messageScrollAreaRef = useRef<HTMLDivElement>(null);

	const sendMessage = async (userMessage: string) => {
		userMessage = userMessage.trim();

		if (discussionId === null || !userMessage) {
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

		let hasDescriptionUpdated = false;

		const onUpdateDescription = (description: string) => {
			form.setValue("description", description);
			hasDescriptionUpdated = true;
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

		if (hasDescriptionUpdated) {
			setIsDescriptionUpdated(true);
		}
	};

	useEffect(() => {
		messageScrollAreaRef.current?.scrollTo({ top: messageScrollAreaRef.current.scrollHeight, behavior: "smooth" });
	}, [discussionMessages]);

	useEffect(() => {
		if (discussionId !== null) {
			return;
		}

		const startDiscussionPromise = speechApiGateway.startDiscussionAboutSpeechDescription(
			{ title: props.title, description: props.description, speakerName: props.speakerName },
			(aiMessage) => {
				setDiscussionMessages((messages) => {
					messages = [...messages];
					const lastMessage = messages[messages.length - 1];

					if (lastMessage?.authorName !== "AI") {
						messages = [
							...messages,
							{ authorName: "AI", authorImageUrl: "/placeholder-user.jpg", message: aiMessage, typing: true },
						];
					} else {
						messages[messages.length - 1] = { ...lastMessage, message: aiMessage, typing: true };
					}

					return messages;
				});
			}
		);

		startDiscussionPromise.then((discussionId) => {
			setDiscussionId(discussionId);

			setDiscussionMessages((messages) => {
				messages = [...messages];
				const lastMessage = messages[messages.length - 1];

				if (lastMessage?.authorName === "AI") {
					messages[messages.length - 1] = { ...lastMessage, typing: false };
				}

				return messages;
			});
		});
	}, [speechApiGateway, discussionId]);

	if (submittedFormValues) {
		return (
			<main className="h-screen pt-12 px-4 flex flex-col items-center">
				<h1 className="text-2xl mb-8 font-bold">請選取上菜的時間</h1>
				<ScheduleForm
					speakerName={submittedFormValues.speakerName}
					speakerEmail={props.speakerEmail}
					speakerDiscordId={props.speakerDiscordId}
					title={props.title}
					description={props.description}
					onBookingSuccessful={(result) => {
						props.onSubmit(result.bookingId);
					}}
				/>
			</main>
		);
	}

	const isAiResponded =
		discussionId !== null &&
		lastDiscussionMessage !== null &&
		lastDiscussionMessage.authorName === "AI" &&
		!lastDiscussionMessage.typing;

	return (
		<main className="flex flex-col bg-muted border-none shadow-lg h-screen _md:h-auto rounded-lg w-full _md:w-96 left-auto">
			<header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between shadow-sm">
				<div className="font-medium text-lg">聊聊你的上菜內容吧</div>
				{discussionMessages.length <= 1 ? (
					<Button
						variant="secondary"
						onClick={() => {
							setSubmittedFormValues(form.getValues());
						}}
					>
						跳過
					</Button>
				) : (
					!isDescriptionUpdated && (
						<Button
							variant="secondary"
							onClick={async () => {
								setIsGeneratingDescription(true);
								const description = await speechApiGateway.generateSpeechDescription(discussionMessages);
								form.setValue("description", description);
								setSubmittedFormValues(form.getValues());
							}}
						>
							{isGeneratingDescription ? <LoadingSpinner /> : "生成活動文宣"}
						</Button>
					)
				)}
			</header>
			<div className="flex-1 overflow-y-auto p-4 space-y-4 h-full _md:min-h-80 _md:max-h-80" ref={messageScrollAreaRef}>
				{discussionMessages.map((message, index) => (
					<div key={index} className="flex items-start gap-4">
						<Avatar className="w-10 h-10">
							<AvatarImage src={message.authorImageUrl} alt={message.authorName} />
							<AvatarFallback>{message.authorName}</AvatarFallback>
						</Avatar>
						<div className="grid gap-1">
							<div className="font-medium">{message.authorName}</div>
							<div className="prose text-muted-foreground space-y-2">
								{index === 0 && (
									<React.Fragment>
										<p>你好！目前已經研擬了一版活動文宣。</p>
										<Card className="w-full max-w-md lg:max-w-xl p-6 grid gap-6 bg-primary text-primary-foreground">
											<div className="grid gap-2">
												<h2 className="text-2xl font-bold">{props.title}</h2>
												<p className="text-primary-foreground">{props.description}</p>
											</div>
										</Card>
									</React.Fragment>
								)}
								<p>{message.message}</p>
							</div>
						</div>
					</div>
				))}
			</div>
			{isDescriptionUpdated ? (
				<div className="bg-background border-t py-4 px-4 flex items-center justify-center gap-2 rounded-b-lg">
					<Button
						className="text-lg py-4 px-6 h-auto"
						onClick={() => {
							setSubmittedFormValues(form.getValues());
						}}
					>
						排定活動時間
					</Button>
				</div>
			) : (
				<div className="bg-background border-t py-2 px-4 flex items-center gap-2 rounded-b-lg">
					<Textarea
						placeholder="和 AI 聊聊生成活動文宣吧！"
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
			)}
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
