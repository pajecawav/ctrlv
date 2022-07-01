import create from "zustand";
import { persist } from "zustand/middleware";

interface NotesHistoryEntry {
	key: string;
	id: string;
	createdAt: number;
	expiresAt?: number | null;
}

interface NotesHistoryStore {
	notes: NotesHistoryEntry[];
	enabled: boolean;
	toggle: () => void;
	addNote: (note: NotesHistoryEntry) => void;
	cleanExpired: () => void;
}

export const useNotesHistoryStore = create<NotesHistoryStore>()(
	persist(
		(set, get) => ({
			notes: [],
			enabled: true,
			toggle: () => set(({ enabled }) => ({ enabled: !enabled })),
			addNote: note => {
				set(({ notes }) => ({ notes: [note, ...notes] }));
			},
			cleanExpired: () => {
				set(({ notes }) => {
					const now = Date.now();
					notes = notes.filter(
						note => !note.expiresAt || note.expiresAt > now
					);
					return { notes };
				});
			},
		}),
		{
			name: "ctrlv.notesHistory",
			onRehydrateStorage: () => state => {
				state?.cleanExpired();
			},
		}
	)
);
