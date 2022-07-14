import preact from "@preact/preset-vite";
import { join } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: join("dist", "static"),
		emptyOutDir: false,
	},
	clearScreen: false,
	plugins: [preact()],
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "http://localhost:8000",
			},
		},
	},
});
