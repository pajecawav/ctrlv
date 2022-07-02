import { useEffect, useState } from "preact/hooks";

function getCurrentHash() {
	return window.location.hash.replace(/^#/, "");
}

export function useHashLocation() {
	const [hash, setHash] = useState(getCurrentHash());

	useEffect(() => {
		const handler = () => setHash(getCurrentHash());

		window.addEventListener("hashchange", handler);
		return () => window.removeEventListener("hashchange", handler);
	}, []);

	return hash;
}
