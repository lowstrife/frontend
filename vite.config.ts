import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import fs from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { compression } from "vite-plugin-compression2";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
	base: "/",
	plugins: [
		vue(),
		tailwindcss(),
		tsconfigPaths(),
		compression(),
		visualizer({
			filename: "dist/bundle-stats.html",
			template: "treemap",
			gzipSize: true,
			brotliSize: true,
			open: true,
		}),
		{
			name: "generate-version-file",
			closeBundle() {
				const versionData = {
					version: process.env.npm_package_version,
					buildTime: new Date().toISOString(),
				};
				fs.writeFileSync(
					path.resolve(__dirname, "dist/version.json"),
					JSON.stringify(versionData, null, 2)
				);
			},
		},
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	assetsInclude: ["**/*.md"],
	build: {
		target: "esnext",
		cssCodeSplit: true,
		sourcemap: true,
		rollupOptions: {
			cache: false,
			watch: false,
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						if (id.includes("posthog")) return "posthog";
						if (id.includes("zod")) return "zod";
						if (id.includes("lodash")) return "lodash";
						if (
							id.includes("dayjs") ||
							id.includes("axios") ||
							id.includes("numbro") ||
							id.includes("unhead")
						)
							return "util";
						if (
							id.includes("vue_devtools") ||
							id.includes("vue-router") ||
							id.includes("vueuc")
						)
							return "vue";
						if (id.includes("naive-ui")) return "naive_ui";
						if (id.includes("vicons")) return "vicons";
						if (id.includes("showdown")) return "showdown_js";
						if (id.includes("esm-bundler")) return "esm_bundler";
						if (id.includes("highcharts")) return "highcharts";
						return "vendor";
					}
					if (id.includes(".md")) return "pp_markdown";
					if (id.includes("/components")) return "pp_components";
					if (id.includes("View")) return "pp_views";
				},
			},
		},
	},
});
