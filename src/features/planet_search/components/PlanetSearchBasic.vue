<script setup lang="ts">
	import { computed, ComputedRef, ref, Ref } from "vue";

	// API
	import { useQuery } from "@/lib/query_cache/useQuery";
	import { useQueryRepository } from "@/lib/query_cache/queryRepository";

	// Types & Interfaces
	import { IPlanet } from "@/features/api/gameData.types";

	// UI
	import { PForm, PFormItem, PInput, PButton } from "@/ui";
	import { SearchSharp } from "@vicons/material";

	const refSearchId: Ref<string | null> = ref(null);

	const emit = defineEmits<{
		(e: "update:results", value: IPlanet[]): void;
	}>();

	const isLoading: Ref<boolean> = ref(false);
	const canSearch: ComputedRef<boolean> = computed(
		() => refSearchId.value !== null && refSearchId.value.length >= 3
	);

	async function doSearch() {
		if (canSearch.value) {
			isLoading.value = true;
			try {
				await useQuery(
					useQueryRepository().repository.GetPlanetSearchSingle,
					{
						searchId: refSearchId.value!,
					}
				)
					.execute()
					.then((data: IPlanet[]) => emit("update:results", data))
					.finally(() => (isLoading.value = false));
			} catch {
				emit("update:results", []);
			}
		}
	}
</script>

<template>
	<div class="flex flex-row flex-wrap gap-3 justify-between">
		<h2 class="text-lg font-bold my-auto">Plan Name or ID</h2>
		<PButton :loading="isLoading" :disabled="!canSearch" @click="doSearch">
			<template #icon><SearchSharp /></template>
			Search
		</PButton>
	</div>

	<div class="py-3 text-white/60">
		Search must include at least 3 characters. Example Searches: "OT-580b",
		"Montem", "OT-"" or "580".
	</div>

	<PForm>
		<PFormItem label="ID">
			<PInput v-model:value="refSearchId" class="w-full" />
		</PFormItem>
	</PForm>
</template>
