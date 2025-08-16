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

	import { PButton, PTooltip } from "@/ui";
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
				<PButton
					size="sm"
					:loading="isLoading"
					@click="isLoading = !isLoading">
					foo
				</PButton>
				<br />
				<PButton size="sm" :loading="isLoading">
					<template #icon><ClearSharp /></template>
				</PButton>
				<br />
				<PButton size="sm">
					<template #icon><ClearSharp /></template>
					foo
				</PButton>
				<br />
				<PButton size="sm" :loading="true">foo</PButton> <br />
				<PButton size="sm" disabled>foo</PButton> <br />
				<br />
				<PButton :loading="isLoading" @click="isLoading = !isLoading">
					foo
				</PButton>
				<br />
				<PButton :loading="isLoading">
					<template #icon><ClearSharp /></template>
				</PButton>
				<br />
				<PButton>
					<template #icon><ClearSharp /></template>
					foo
				</PButton>
				<br />
				<PButton :loading="true">foo</PButton> <br />
				<PButton disabled>foo</PButton> <br />
				<br />
				<br />
				<PButton type="secondary">foo</PButton> <br />
				<PButton type="secondary">
					<template #icon><ClearSharp /></template>
					foo
				</PButton>
				<br />
				<PButton type="secondary" :loading="true">foo</PButton> <br />
				<PButton type="secondary" disabled>foo</PButton> <br />
				<br />
				<PButton type="success">foo</PButton> <br />
				<PButton type="success" :loading="true">foo</PButton> <br />
				<PButton type="success" disabled>foo</PButton> <br />
				<br />
				<PButton type="error">foo</PButton> <br />
				<PButton type="error">
					<template #icon><ClearSharp /></template>
					foo
				</PButton>
				<br />
				<PButton type="error" :loading="true">foo</PButton> <br />
				<PButton type="error" disabled>foo</PButton> <br />
				<br />
				<PButton type="warning">foo</PButton> <br />
				<PButton type="warning">
					<template #icon><ClearSharp /></template>
					foo
				</PButton>
				<br />
				<PButton type="warning" :loading="true">foo</PButton> <br />
				<PButton type="warning" disabled>foo</PButton> <br />
				<br />
				<br />
				<NButton>foo</NButton><br />
				<NButton>
					<template #icon><ClearSharp /></template>
					foo
				</NButton>
				<br />
				<NButton loading>foo</NButton><br />
				<NButton disabled>foo</NButton><br />
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
