import path from "path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	test: {
		globals: true,
		env: loadEnv("", ""),
		exclude: ["**/node_modules/**", "**/dist/**", "**/coverage/**"],
		coverage: {
			enabled: true,
			provider: "v8",
			reporter: [["lcov", { projectRoot: "./src" }], ["html"]],
			include: ["src/**"],
			exclude: [
				"src/layout/*",
				"src/App.vue",
				"src/main.ts",
				"src/views/*",
				"src/router/*",
				"**/components/**",
			],
			reportOnFailure: true,
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	plugins: [vue()],
});
