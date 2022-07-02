import { useTheme } from "../hooks/useTheme";
import { IconButton } from "./IconButton";
import { MoonIcon } from "./icons/MoonIcon";
import { SunIcon } from "./icons/SunIcon";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<IconButton onClick={toggleTheme} title="Toggle theme">
			{theme === "light" ? <MoonIcon /> : <SunIcon />}
		</IconButton>
	);
}
