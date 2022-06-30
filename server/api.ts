import { FastifyPluginCallback } from "fastify";
import { z } from "zod";
import { createNote, findNote } from "./db";
import { badRequest, notFound } from "./responses";
import { Note, Response } from "./types";

const createNoteSchema = z.object({
	text: z.string().max(20000),
	expirationTimeSeconds: z
		.number()
		.max(365 * 24 * 60 * 60) // 1 year
		.nullable()
		.default(null),
});
type CreateNoteSchema = z.infer<typeof createNoteSchema>;

export const apiRouter: FastifyPluginCallback = async (api, options) => {
	api.get<{ Params: { id: string }; Reply: Response<Note | null> }>(
		"/notes/:id",
		async (req, reply) => {
			const { id } = req.params;
			const note = await findNote(id);

			if (!note) {
				return notFound(reply);
			}

			return { data: note };
		}
	);

	api.post<{ Reply: Response<Note> }>("/notes", async (req, reply) => {
		await createNoteSchema.parse(req.body);
		const parsedBody = createNoteSchema.safeParse(req.body);

		if (!parsedBody.success) {
			return badRequest(reply);
		}

		const {
			data: { text, expirationTimeSeconds },
		} = parsedBody;
		const expiresAt = expirationTimeSeconds
			? Date.now() + expirationTimeSeconds * 1000
			: null;

		const note = await createNote({ text, expiresAt });

		return { data: note };
	});
};
