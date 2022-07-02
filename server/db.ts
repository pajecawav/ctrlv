import Database from "better-sqlite3";
import { customAlphabet } from "nanoid";
import { Note } from "./types";

const dbUrl = process.env.DATABASE_URL ?? ":memory:";
console.log(`Opening database ${dbUrl}`);
const db = new Database(dbUrl);

function initDb() {
	db.prepare(
		`CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY NOT NULL,
            text TEXT NOT NULL,
            createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
            expiresAt INTEGER
        );`
	).run();
}

initDb();

const ALPHABET =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(ALPHABET, 10);

export async function createNote({
	text,
	expiresAt = null,
}: {
	text: string;
	expiresAt?: number | null;
}): Promise<Note> {
	const note = { id: nanoid(), text, createdAt: Date.now(), expiresAt };

	db.prepare(
		"INSERT INTO notes VALUES (@id, @text, @createdAt, @expiresAt)"
	).run(note);

	return note;
}

export async function findNote(id: string): Promise<Note | null> {
	const note: Note = db
		.prepare(
			`SELECT id, text, createdAt, expiresAt FROM notes
             WHERE id = @id
             AND (expiresAt IS NULL OR expiresAt > @now)`
		)
		.get({ id, now: Date.now() });

	return note;
}
