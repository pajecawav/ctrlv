import { ComponentProps } from "preact";
import { cn } from "../utils";

interface SpinnerProps extends ComponentProps<"div"> {}

export function Spinner({ className, ...props }: SpinnerProps) {
	return (
		<div
			className={cn(
				"w-[1em] h-[1em] inline-block rounded-full animate-spin-fast border-2 border-current border-b-transparent border-l-transparent",
				className
			)}
			{...props}
			aria-hidden="true"
			role="img"
		/>
	);
}
