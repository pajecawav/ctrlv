import { Link } from "wouter-preact";
import { IconButton } from "./IconButton";
import { CollectionIcon } from "./icons/CollectionIcon";
import { GithubIcon } from "./icons/GithubIcon";
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

				<IconButton
					as="a"
					href="https://github.com/pajecawav/ctrlv"
					target="_blank"
					rel="noopener noreferrer"
					title="Source code"
				>
					<GithubIcon />
				</IconButton>
			</div>
		</header>
	);
}
