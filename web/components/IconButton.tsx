import { ComponentProps, ComponentType } from "preact";
import { cn } from "../utils";

interface IconButtonProps extends Omit<ComponentProps<"button">, "as"> {
	as?: ComponentType<any> | keyof JSX.IntrinsicElements;
}

export function IconButton({
	className,
	as: Component = "button",
	...props
}: IconButtonProps) {
	return (
		<Component
			className={cn(
				"rounded-md p-[0.25em] transition-all",
				"hover:bg-zinc-100 active:bg-zink-200 dark:hover:bg-zinc-700 dark:active:bg-zinc-600",
				className
			)}
			{...props}
		/>
	);
}
