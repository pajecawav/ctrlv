import { $fetch, FetchError } from "ohmyfetch";
import { useEffect, useState } from "preact/hooks";
import useSWR from "swr";
import type { Note, Response } from "../../server/types";
import { Spinner } from "../components/Spinner";
import { Textarea } from "../components/Textarea";
import { decryptData } from "../encryption";

interface NotePageProps {
	id: string;
}

function getCurrentHash() {
	return window.location.hash.replace(/^#/, "");
}

function useHashLocation() {
	const [hash, setHash] = useState(getCurrentHash());

	useEffect(() => {
		const handler = () => setHash(getCurrentHash());

		window.addEventListener("hashchange", handler);
		return () => window.removeEventListener("hashchange", handler);
	}, []);

	return hash;
}

export function NotePage({ id }: NotePageProps) {
	const hash = useHashLocation();

	const {
		data,
		isValidating,
		error: apiError,
	} = useSWR<Response<Note>, FetchError>(
		`/api/notes/${id}`,
		() => $fetch<Response<Note>>(`/api/notes/${id}`),
		{ revalidateIfStale: false }
	);

	const [text, setText] = useState<string | null>(null);
	const [encryptionError, setEncryptionError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		async function decrypt() {
			if (!data) {
				return;
			}

			if (!hash) {
				setEncryptionError("Encryption key is missing in URL");
				return;
			}

			try {
				const decrypted = await decryptData(data.data.text, hash);
				if (active) {
					setText(decrypted);
				}
			} catch (e) {
				setEncryptionError("Failed to decrypt data");
				return;
			}
		}

		decrypt();

		return () => {
			active = false;
		};
	}, [data, hash]);

	const error = apiError?.response?.statusText || encryptionError;

	return (
		<div className="flex flex-col flex-grow gap-1">
			{error && <div className="text-red-400 mx-auto">{error}</div>}

			<div className="relative flex-grow flex">
				<Textarea
					className="flex-grow"
					disabled={true}
					value={text ?? ""}
				/>
				{!text && (
					<span className="absolute inset-0 grid place-items-center bg-black/10">
						<Spinner />
					</span>
				)}
			</div>
		</div>
	);
}
