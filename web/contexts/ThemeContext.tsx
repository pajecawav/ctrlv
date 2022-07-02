import { ComponentChildren, createContext } from "preact";
import { useEffect, useState } from "preact/hooks";

type Theme = "light" | "dark";

const themeKey = "ctrlv.theme";

function getInitialTheme(): Theme {
	const storedTheme = localStorage.getItem(themeKey) as Theme | null;
	if (storedTheme) {
		return storedTheme;
	}

	const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
	if (userMedia.matches) {
		return "dark";
	}

	return "light";
}

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeContextProvider({
	children,
}: {
	children: ComponentChildren;
}) {
	const [theme, setTheme] = useState<Theme>(getInitialTheme());

	function rawSetTheme(theme: Theme) {
		const root = document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}

	function toggleTheme() {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
	}

	useEffect(() => {
		rawSetTheme(theme);
		localStorage.setItem(themeKey, theme);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
