import { ComponentProps } from "preact";
import { cn } from "../utils";
import { Spinner } from "./Spinner";

interface ButtonProps extends ComponentProps<"button"> {
	isLoading?: boolean;
}

export function Button({
	isLoading = false,
	className,
	children,
	disabled,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(
				"relative rounded-md px-3 py-1 transition-[background-color] disabled:opacity-75",
				"enabled:hover:bg-zinc-100 enabled:active:bg-zinc-200 dark:enabled:hover:bg-zinc-700 dark:enabled:active:bg-zinc-600",
				className
			)}
			disabled={isLoading || disabled}
			{...props}
		>
			<span className={cn(isLoading && "opacity-0")}>{children}</span>

			{isLoading && (
				<span className="absolute inset-0 grid place-items-center">
					<Spinner />
				</span>
			)}
		</button>
	);
}
