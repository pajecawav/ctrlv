import { Link } from "wouter-preact";
import { useNotesHistoryStore } from "../stores/useNotesHistoryStore";
import { formatCreatedDate, formatRelativeTime } from "../utils";

export function HistoryPage() {
	const store = useNotesHistoryStore();

	return (
		<ul className="flex flex-col gap-1">
			{store.notes.map(note => (
				<li key={note.id}>
					<Link
						className="flex justify-between gap-4"
						to={`/${note.id}#${note.key}`}
					>
						<span>{note.id}</span>

						<span title={new Date(note.createdAt).toLocaleString()}>
							created {formatCreatedDate(note.createdAt)}
						</span>
					</Link>
				</li>
			))}
		</ul>
	);
}
