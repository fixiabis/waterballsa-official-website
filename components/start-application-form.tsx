import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
	abstract: z.string().trim().min(1, { message: "Required" }),
});

export type StartApplicationFormValues = z.infer<typeof formSchema>;

export interface StartApplicationFormProps {
	userId: string;
	userUsername: string;
	userImageUrl: string;
	onSubmit: (values: StartApplicationFormValues) => void;
}

export function StartApplicationForm(props: StartApplicationFormProps) {
	const form = useForm<StartApplicationFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			abstract: "",
		},
	});

	return (
		<Card className="w-full max-w-md lg:max-w-lg relative p-4 lg:p-6 rounded-lg shadow-lg">
			<h1 className="font-bold lg:text-2xl">
				👋 Hi {props.userUsername}!{/* eslint-disable-next-line @next/next/no-img-element */}
				<img className="w-8 h-8 inline-block rounded-full float-right" src={props.userImageUrl} alt="用戶頭像" />
			</h1>
			<Form {...form}>
				<form className="w-full flex items-end space-x-2" onSubmit={form.handleSubmit(props.onSubmit)}>
					<FormField
						control={form.control}
						name="abstract"
						render={({ field }) => (
							<FormItem className="w-full">
								{/* WORKAROUND: 用 text-current 規避 react-hook-form & shadcn 在表單有錯誤時會使 label 文字變紅的情況 */}
								<FormLabel className="text-current lg:text-lg">用一句話表達你想要分享的內容</FormLabel>
								<FormControl>
									<Input className="lg:text-md" placeholder="想分享些什麼？" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<Button className="lg:text-md" type="submit">
						送出
					</Button>
				</form>
			</Form>
		</Card>
	);
}
