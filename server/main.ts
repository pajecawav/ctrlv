// for some reason calling dotenv.config doesn't work correctly
import "dotenv/config";

import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import path from "path";
import { apiRouter } from "./api";

const isDev = process.env.NODE_ENV === "development";

const PORT = parseInt(process.env.PORT ?? "", 10) || 8000;
const HOST = process.env.HOST || "0.0.0.0";

const server = fastify({
	logger: {
		transport: isDev
			? {
					target: "pino-pretty",
					options: {
						translateTime: "HH:MM:ss Z",
						ignore: "pid,hostname",
					},
			  }
			: undefined,
	},
});

if (!isDev) {
	// server static React files in production
	server.register(fastifyStatic, {
		root: path.join(__dirname, "static"),
	});
}

server.register(apiRouter, { prefix: "/api" });

server.setNotFoundHandler((req, res) => {
	res.sendFile("index.html");
});

server.listen({ port: PORT, host: HOST }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
