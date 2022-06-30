import { ComponentProps } from "preact";
import { cn } from "../utils";

interface IconButtonProps extends ComponentProps<"button"> {}

export function IconButton({ className, ...props }: IconButtonProps) {
	return (
		<button
			className={cn(
				"rounded-md p-[0.25em] transition-all disabled:opacity-75",
				"enabled:hover:bg-zinc-100 enabled:active:bg-zink-200 dark:enabled:hover:bg-zinc-700 dark:enabled:active:bg-zinc-600",
				className
			)}
			{...props}
		/>
	);
}
