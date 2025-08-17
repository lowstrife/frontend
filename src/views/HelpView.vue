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

	import { PButton, PTooltip, PButtonGroup } from "@/ui";
	import { ClearSharp } from "@vicons/material";
	import { NButton } from "naive-ui";

	const isLoading = ref(false);
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
				<PTooltip>
					<div>meow</div>
					<template #trigger>
						<PButton>Tooltipfoo</PButton>
					</template>
				</PTooltip>
				<br />
				<br />
				<br />
				<PButtonGroup>
					<PButton> foo </PButton>
					<PButton type="error">
						<template #icon><ClearSharp /></template>
						Delete
					</PButton>
					<PButton
						type="secondary"
						:loading="isLoading"
						@click="isLoading = !isLoading">
						foo
					</PButton>
				</PButtonGroup>
				<br />
				<br />
				<PButtonGroup vertical>
					<PButton size="sm"> foo </PButton>
					<PButton type="error" size="sm">
						<template #icon><ClearSharp /></template>
						Delete
					</PButton>
					<PButton
						size="sm"
						:loading="isLoading"
						@click="isLoading = !isLoading">
						foo
					</PButton>
				</PButtonGroup>
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
