import { SWRConfig, SWRConfiguration } from "swr";
import { Redirect, Route, Switch } from "wouter-preact";
import { Header } from "./components/Header";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { HistoryPage } from "./pages/history";
import { HomePage } from "./pages/home";
import { NotePage } from "./pages/note";

const swrConfig: SWRConfiguration = {
	revalidateOnFocus: false,
};

export default function App() {
	return (
		<SWRConfig value={swrConfig}>
			<ThemeContextProvider>
				<div className="max-w-3xl full-screen-height mx-auto px-2 pb-2 flex flex-col font-medium dark:text-zinc-300">
					<Header />

					<main className="flex-grow flex flex-col">
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
			</ThemeContextProvider>
		</SWRConfig>
	);
}
