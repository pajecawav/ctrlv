import { $fetch } from "ohmyfetch";
import useSWR from "swr";
import type { Note, Response } from "../../server/types";
import { Spinner } from "../components/Spinner";
import { Textarea } from "../components/Textarea";

interface NotePageProps {
	id: string;
}

export function NotePage({ id }: NotePageProps) {
	const apiUrl = `/api/notes/${id}`;

	const { data, isValidating } = useSWR(
		apiUrl,
		() => $fetch<Response<Note>>(apiUrl),
		{ revalidateIfStale: false }
	);

	return (
		<div className="flex flex-col flex-grow relative">
			<Textarea
				className="flex-grow"
				disabled={true}
				value={data?.data.text || ""}
			/>
			{!data && (
				<span className="absolute inset-0 grid place-items-center bg-black/10">
					<Spinner />
				</span>
			)}
		</div>
	);
}
