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

		console.log(markdownFiles);

		return await loader();
	}

	const markdownContent: Ref<string> = ref("");

	onMounted(async () => (markdownContent.value = await loadMarkdown()));

	import { NButton } from "naive-ui";
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
				To be written...
				<div class="flex flex-col gap-3 w-[100px]">
					<n-button>default</n-button>
					<n-button type="primary">primary</n-button>
					<n-button type="info">info</n-button>
					<n-button type="success">success</n-button>
					<n-button type="warning">warning</n-button>
					<n-button type="error">error</n-button>
					<n-button secondary>default</n-button>
					<n-button type="primary" secondary>primary</n-button>
					<n-button type="info" secondary>info</n-button>
					<n-button type="success" secondary>success</n-button>
					<n-button type="warning" secondary>warning</n-button>
					<n-button type="error" secondary>error</n-button>
				</div>
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
