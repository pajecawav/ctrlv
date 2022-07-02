import { Link } from "wouter-preact";
import { IconButton } from "./IconButton";
import { CollectionIcon } from "./icons/CollectionIcon";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
	return (
		<header className="flex items-center justify-between py-2">
			<Link href="/new" className="text-lg">
				ctrlv
			</Link>

			<div className="flex gap-1 text-xl">
				<Link href="/history">
					<IconButton as="a" title="Open notes history">
						<CollectionIcon />
					</IconButton>
				</Link>
				<ThemeToggle />
			</div>
		</header>
	);
}
