import Database from "better-sqlite3";
import { customAlphabet } from "nanoid";
import { Note } from "./types";

const db = new Database(":memory:");

function initDb() {
	db.prepare(
		`CREATE TABLE IF NOT EXISTS notes (
            id STRING PRIMARY KEY NOT NULL,
            text TEXT NOT NULL
        );`
	).run();
}

initDb();

const ALPHABET =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(ALPHABET, 10);

export async function createNote({ text }: { text: string }): Promise<Note> {
	const note = { id: nanoid(), text };

	const result = db
		.prepare("INSERT INTO notes VALUES (@id, @text)")
		.run(note);

	return note;
}

export async function findNotes(): Promise<Note[]> {
	const notes: Note[] = db.prepare("SELECT id, text FROM notes").all();

	return notes;
}

export async function findNote(id: string): Promise<Note | null> {
	const note: Note = db
		.prepare("SELECT id, text FROM notes WHERE id = ?")
		.get(id);

	return note;
}
