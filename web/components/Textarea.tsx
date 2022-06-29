import { ComponentProps } from "preact";
import { forwardRef } from "preact/compat";
import { cn } from "../utils";

interface TextareaProps extends ComponentProps<"textarea"> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => (
		<textarea
			className={cn(
				"px-2 py-1 rounded-md bg-transparent outline-none placeholder:text-gray-500",
				"border-2 border-zinc-400 focus:border-black  dark:border-zinc-700 dark:focus:border-zinc-600",
				className
			)}
			{...props}
			ref={ref}
		/>
	)
);
