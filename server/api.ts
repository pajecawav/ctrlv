import { FastifyPluginCallback } from "fastify";
import { z } from "zod";
import { createNote, findNote, findNotes } from "./db";
import { badRequest, notFound } from "./responses";
import { Note, Response } from "./types";

const createNoteSchema = z.object({
	text: z.string().max(20000),
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
		console.log(req.body, typeof req.body);
		await createNoteSchema.parse(req.body);
		const parsedBody = createNoteSchema.safeParse(req.body);

		if (!parsedBody.success) {
			return badRequest(reply);
		}

		const { data } = parsedBody;
		const note = await createNote(data);

		return { data: note };
	});
};
