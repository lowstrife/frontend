<script setup lang="ts">
	import { ref, Ref } from "vue";

	// API
	import { callDataPlanetSearchSingle } from "@/features/api/gameData.api";

	// Types & Interfaces
	import { IPlanet } from "@/features/api/gameData.types";

	// UI
	import { NForm, NFormItem, NInput, NButton } from "naive-ui";
	import { SearchSharp } from "@vicons/material";

	const refSearchId: Ref<string | null> = ref(null);

	const emit = defineEmits<{
		(e: "update:results", value: IPlanet[]): void;
	}>();

	async function doSearch() {
		if (refSearchId.value !== null && refSearchId.value.length >= 3) {
			const result = await callDataPlanetSearchSingle(refSearchId.value);
			emit("update:results", result);
		}
	}
</script>

<template>
	<div class="flex flex-row justify-between">
		<h2 class="text-lg font-bold my-auto">Plan Name or ID</h2>
		<n-button size="small" @click="doSearch">
			<template #icon><SearchSharp /></template>
			Search
		</n-button>
	</div>

	<div class="py-3 text-white/60">
		Search must include at least 3 characters. Example Searches: "OT-580b",
		"Montem", "OT-"" or "580".
	</div>

	<n-form
		inline
		label-placement="left"
		label-width="auto"
		label-align="left"
		class="flex-grow"
		size="small">
		<n-form-item class="!w-full">
			<n-input v-model:value="refSearchId" />
		</n-form-item>
	</n-form>
</template>
