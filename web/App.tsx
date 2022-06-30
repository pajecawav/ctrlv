import { SWRConfig, SWRConfiguration } from "swr";
import { Link, Redirect, Route, Switch } from "wouter-preact";
import { ThemeToggle } from "./components/ThemeToggle";
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

					<ThemeToggle />
				</header>

				<main className="mt-2 flex-grow flex flex-col">
					<Switch>
						<Route path="/new" component={HomePage} />
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
