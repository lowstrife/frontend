import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { compression } from "vite-plugin-compression2";

// https://vite.dev/config/
export default defineConfig({
	base: "/",
	plugins: [vue(), tailwindcss(), tsconfigPaths(), compression()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	assetsInclude: ["**/*.md"],
	build: {
		target: "esnext",
		cssCodeSplit: true,
		rollupOptions: {
			cache: false,
			watch: false,
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						const parts = id.split("node_modules/.pnpm/");
						if (parts[1]) {
							const pkgName = parts[1].split("/")[0];
							if (pkgName && pkgName.length > 0) {
								return pkgName;
							}
						}
					}
				},
			},
		},
	},
});
