import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
	speakerName: z.string().trim().min(1, { message: "稱呼不可為空" }),
	speakerDiscordId: z.string().trim().min(1, { message: "Discord ID 不可為空" }),
	title: z.string().trim().min(1, { message: "標題不可沒有內容" }),
	description: z.string().trim().min(1, { message: "描述不可沒有內容" }),
});

export type SpeechApplicationFormValues = z.infer<typeof formSchema>;

export interface SpeechApplicationFormProps {
	form: UseFormReturn<SpeechApplicationFormValues, object>;
	onSubmit: React.FormEventHandler<HTMLFormElement>;
	onDiscussDescription: () => void;
}

export function SpeechApplicationForm(props: SpeechApplicationFormProps) {
	const { form } = props;

	return (
		<Card className="w-full max-w-md lg:max-w-xl p-4 rounded-lg shadow-lg">
			<Form {...form}>
				<form className="flex flex-col items-center space-y-3" onSubmit={props.onSubmit}>
					<FormField
						control={form.control}
						name="speakerName"
						render={({ field }) => (
							<FormItem className="w-full space-y-1">
								<FormLabel>暱稱</FormLabel>
								<FormControl>
									<Input placeholder="你的暱稱" {...field} />
								</FormControl>
								<FormMessage className="font-normal text-xs" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem className="w-full space-y-1">
								<FormLabel>標題</FormLabel>
								<FormControl>
									<Input placeholder="標題" {...field} />
								</FormControl>
								<FormMessage className="font-normal text-xs" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="w-full space-y-1">
								<FormLabel>描述</FormLabel>
								<FormControl>
									<Textarea placeholder="和 AI 聊聊你的上菜內容就能產生描述！" {...field} />
								</FormControl>
								<FormMessage className="font-normal text-xs" />
							</FormItem>
						)}
					/>
					<FormItem className="w-full flex items-center justify-end space-x-2 space-y-0">
						<Button className="py-4 px-6" variant="outline" type="button" onClick={props.onDiscussDescription}>
							與 AI 聊聊產生描述
						</Button>
						<Button className="py-4 px-6" type="submit">
							排定活動時間
						</Button>
					</FormItem>
				</form>
			</Form>
		</Card>
	);
}

export function useSpeechApplicationForm(defaultValues: Partial<SpeechApplicationFormValues>) {
	return useForm<SpeechApplicationFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			speakerName: "",
			speakerDiscordId: "",
			...defaultValues,
		},
	});
}
