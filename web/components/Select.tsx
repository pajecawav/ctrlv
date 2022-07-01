import { ComponentProps } from "preact";
import { cn } from "../utils";
import { ChevronDownIcon } from "./icons/ChevronDownIcon";

interface SelectProps extends Omit<ComponentProps<"select">, "className"> {}

export function Select(props: SelectProps) {
	return (
		<div className="relative w-max">
			<select
				className={cn(
					"pl-4 pr-8 py-1 rounded-md bg-white transition-colors outline-none appearance-none dark:bg-zinc-800",
					"border-2 border-zinc-400 focus:border-black dark:border-zinc-700 dark:focus:border-zinc-500"
				)}
				{...props}
			/>
			<div className="absolute top-0 right-2 bottom-0 grid place-items-center">
				<ChevronDownIcon />
			</div>
		</div>
	);
}
