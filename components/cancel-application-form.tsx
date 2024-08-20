import { useForm, UseFormReturn } from "react-hook-form";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formSchema = z.object({
	reason: z.string().trim().min(1, { message: "請選擇取消原因" }),
});

export type CancelApplicationFormValues = z.infer<typeof formSchema>;

export interface CancelApplicationFormProps {
	onSubmit: React.FormEventHandler<HTMLFormElement>;
	onCancel: () => void;
}

export function CancelApplicationForm(props: CancelApplicationFormProps) {
	const form = useForm<CancelApplicationFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			reason: "",
		},
	});

	return (
		<Card className="w-full max-w-md lg:max-w-xl p-4 rounded-lg shadow-lg">
			<Form {...form}>
				<form className="flex flex-col items-center space-y-3" onSubmit={props.onSubmit}>
					<FormField
						control={form.control}
						name="reason"
						render={({ field }) => (
							<FormItem className="w-full space-y-1">
								<FormLabel>取消原因</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="請選擇取消原因" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="後悔了">後悔了</SelectItem>
										<SelectItem value="其他個人因素">個人因素</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormItem className="w-full flex items-center justify-end space-x-2 space-y-0">
						<Button variant="outline" className="py-4 px-6" type="button" onClick={props.onCancel}>
							返回
						</Button>
						<Button variant="destructive" className="py-4 px-6" type="submit">
							取消上菜
						</Button>
					</FormItem>
				</form>
			</Form>
		</Card>
	);
}
