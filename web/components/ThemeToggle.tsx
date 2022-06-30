import { useEffect, useState } from "preact/hooks";
import { IconButton } from "./IconButton";
import { MoonIcon } from "./icons/MoonIcon";
import { SunIcon } from "./icons/SunIcon";

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

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>(getInitialTheme());

	function rawSetTheme(theme: Theme) {
		const root = document.documentElement;
		if (theme === "light") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}

	function toggleTheme() {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem(themeKey, newTheme);
	}

	useEffect(() => {
		rawSetTheme(theme);
	}, [theme]);

	return (
		<IconButton
			className="text-xl"
			onClick={toggleTheme}
			aria-label="Toggle theme"
		>
			{theme === "light" ? <SunIcon /> : <MoonIcon />}
		</IconButton>
	);
}
