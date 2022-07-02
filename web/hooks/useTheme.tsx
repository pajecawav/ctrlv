import { useContext } from "preact/hooks";
import { ThemeContext } from "../contexts/ThemeContext";

export function useTheme() {
	const ctx = useContext(ThemeContext);

	if (!ctx) {
		throw new Error(`useTheme is missing a ThemeContext`);
	}

	return ctx;
}
