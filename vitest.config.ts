import path from "path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	test: {
		globals: true,
		env: loadEnv("", ""),
		exclude: [
			"**/node_modules/**",
			"**/dist/**",
			"**/coverage/**",
			"*.config.js",
			"*.config.ts",
			"src/layout/*",
			"src/components/*",
			"src/views/*",
			"src/router/*",
		],
		coverage: {
			enabled: true,
			provider: "v8",
			reporter: [["lcov", { projectRoot: "./src" }], ["html"], ["text"]],
			include: ["src/**"],
			exclude: [
				"src/layout/*",
				"src/App.vue",
				"src/main.ts",
				"src/components/*",
				"src/views/*",
				"src/router/*",
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
