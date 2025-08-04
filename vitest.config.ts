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
			"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
			"**/cypress/**",
			"**/.{idea,git,cache,output,temp}/**",
		],
		environment: "jsdom",
		coverage: {
			enabled: true,
			provider: "v8",
			reporter: [["lcov", { projectRoot: "./src" }], ["html"]],
			include: ["src/**"],
			exclude: [
				"src/layout/*",
				"src/AppProvider.vue",
				"src/App.vue",
				"src/main.ts",
				"src/views/*",
				"**/components/**",
				"**/dist/**",
				"src/tests/**",
				"**/queryRepository.ts",
				"**/QueryCacheView.vue",
				"src/features/wrapper/**",
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
