import { Link } from "wouter-preact";
import { Button } from "../components/Button";
import { useNotesHistoryStore } from "../stores/useNotesHistoryStore";
import { formatCreatedDate } from "../utils";

export function HistoryPage() {
	const store = useNotesHistoryStore();

	function handleClean() {
		const notesCount = store.notes.length;
		const word = notesCount === 1 ? "note" : "notes";

		if (
			notesCount > 0 &&
			confirm(
				`Are you sure you want to delete ${notesCount} ${word} from history?`
			)
		) {
			store.clean();
		}
	}

	if (store.notes.length === 0) {
		return (
			<div className="grid h-32 place-items-center text-lg text-zinc-500 dark:text-zinc-400">
				History is empty.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<Button className="self-end" onClick={handleClean}>
				Clear
			</Button>

			<ul className="flex flex-col gap-1">
				{store.notes.map(note => (
					<li key={note.id}>
						<Link
							className="flex justify-between gap-4"
							to={`/${note.id}#${note.key}`}
						>
							<span>{note.id}</span>

							<span
								title={new Date(
									note.createdAt
								).toLocaleString()}
							>
								created {formatCreatedDate(note.createdAt)}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
