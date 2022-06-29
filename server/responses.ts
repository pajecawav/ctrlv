import { FastifyReply } from "fastify";

export function badRequest(reply: FastifyReply, message = "Bad request") {
	return reply.code(400).send(new Error(message));
}

export function notFound(reply: FastifyReply, message = "Not found") {
	return reply.code(404).send(new Error(message));
}
