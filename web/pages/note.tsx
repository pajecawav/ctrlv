import { $fetch, FetchError } from "ohmyfetch";
import { useEffect, useState } from "preact/hooks";
import useSWR from "swr";
import type { Note, Response } from "../../server/types";
import { Spinner } from "../components/Spinner";
import { Textarea } from "../components/Textarea";
import { decryptData } from "../encryption";
import { formatCreatedDate, formatRelativeTime } from "../utils";

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
		`/api/notes/${id}#${hash}`,
		async () => {
			const response = await $fetch<Response<Note>>(`/api/notes/${id}`);

			if (!hash) {
				throw new Error("Encryption key is missing in URL");
			}

			try {
				response.data.text = await decryptData(
					response.data.text,
					hash
				);
			} catch (e) {
				console.error(e);
				throw new Error("Failed to decrypt data");
			}

			return response;
		},
		{ revalidateIfStale: false }
	);

	const text = data?.data.text;
	const error = apiError?.response?.statusText || apiError?.message;

	return (
		<div className="flex flex-col flex-grow gap-2">
			{error && <div className="text-red-400 mx-auto">{error}</div>}

			{data && (
				<div className="flex justify-between">
					<div title={new Date(data.data.createdAt).toLocaleString()}>
						Created {formatCreatedDate(data.data.createdAt)}
					</div>
					{data.data.expiresAt && (
						<div
							title={new Date(
								data.data.expiresAt
							).toLocaleString()}
						>
							Expires {formatRelativeTime(data.data.expiresAt)}
						</div>
					)}
				</div>
			)}

			<div className="relative flex-grow flex">
				<Textarea
					className="flex-grow"
					disabled={true}
					value={text ?? ""}
				/>
				{!text && (
					<span className="absolute inset-0 grid place-items-center bg-zinc-200/50 dark:bg-zinc-700/50">
						<Spinner />
					</span>
				)}
			</div>
		</div>
	);
}
