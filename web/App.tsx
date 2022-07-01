import { SWRConfig, SWRConfiguration } from "swr";
import { Link, Redirect, Route, Switch } from "wouter-preact";
import { IconButton } from "./components/IconButton";
import { CollectionIcon } from "./components/icons/CollectionIcon";
import { ThemeToggle } from "./components/ThemeToggle";
import { HistoryPage } from "./pages/history";
import { HomePage } from "./pages/home";
import { NotePage } from "./pages/note";

const swrConfig: SWRConfiguration = {
	revalidateOnFocus: false,
};

export default function App() {
	return (
		<SWRConfig value={swrConfig}>
			<div className="max-w-3xl min-h-screen mx-auto px-2 pb-2 flex flex-col font-medium dark:text-zinc-300">
				<header className="flex items-center justify-between py-2">
					<Link href="/new" className="text-lg">
						ctrlv
					</Link>

					<div className="flex text-xl">
						<Link href="/history">
							<IconButton as="a" title="Open notes history">
								<CollectionIcon />
							</IconButton>
						</Link>
						<ThemeToggle />
					</div>
				</header>

				<main className="mt-2 flex-grow flex flex-col">
					<Switch>
						<Route path="/new" component={HomePage} />
						<Route path="/history" component={HistoryPage} />
						<Route path="/:id">
							{({ id }) => <NotePage id={id} />}
						</Route>
						<Redirect to="/new" />
					</Switch>
				</main>
			</div>
		</SWRConfig>
	);
}
