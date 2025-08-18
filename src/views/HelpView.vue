<script setup lang="ts">
	import { onMounted, Ref, ref } from "vue";
	import { useHead } from "@unhead/vue";

	useHead({
		title: "Help | PRUNplanner",
	});

	import { VueShowdown } from "vue-showdown";

	// markdown loader from changelog
	async function loadMarkdown(): Promise<string> {
		const markdownFiles = import.meta.glob("@/assets/help/*.md", {
			query: "?raw",
			import: "default",
		}) as Record<string, () => Promise<string>>;

		const path = `/src/assets/help/changelog.md`;
		const loader = markdownFiles[path];
		if (!loader) throw new Error(`Markdown file "changelog" not found.`);

		return await loader();
	}

	const markdownContent: Ref<string> = ref("");

	onMounted(async () => (markdownContent.value = await loadMarkdown()));

	import { PInputNumber } from "@/ui";
	import { NInputNumber } from "naive-ui";
	const n = ref(0);
</script>

<template>
	<div class="min-h-screen flex flex-col">
		<div
			class="px-6 py-3 border-b border-white/10 flex flex-row justify-between">
			<h1 class="text-2xl font-bold my-auto">Help & Changelog</h1>
		</div>

		<div
			class="flex-grow grid grid-cols-1 lg:grid-cols-[60%_auto] gap-3 divide-x divide-white/10 child:px-6 child:py-3">
			<div>
				<h2 class="text-xl font-bold pb-3">Help</h2>
				...

				<br />
				<br />
				<PInputNumber v-model:value="n" :min="5" />
				<br />
				<PInputNumber v-model:value="n" :min="5" decimals />
				<br />
				<div class="w-[100px]">
					<PInputNumber
						v-model:value="n"
						:min="5"
						:max="10"
						show-buttons />
				</div>
				<br />
				<br />
				<NInputNumber size="small" v-model:value="n" show-button />
				<br />
				<br />
			</div>
			<div>
				<h2 class="text-xl font-bold pb-3">Changelog</h2>
				<div v-if="markdownContent != ''" id="markdown">
					<VueShowdown :markdown="markdownContent" />
				</div>
			</div>
		</div>
	</div>
</template>
