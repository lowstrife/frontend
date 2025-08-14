<script setup lang="ts">
	import { computed, PropType } from "vue";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Types & Interfaces
	import { SelectMixedOption } from "naive-ui/es/select/src/interface";

	// UI
	import { NCheckbox, NSelect } from "naive-ui";

	const props = defineProps({
		searchedMaterial: {
			type: String,
			required: true,
		},
		filterPlanet: {
			type: null as unknown as PropType<string | null>,
			required: false,
			default: null,
		},
		filterBuilding: {
			type: null as unknown as PropType<string | null>,
			required: false,
			default: null,
		},
		filterPositiveROI: {
			type: Boolean,
			required: true,
		},
		planetOptions: {
			type: Array as PropType<SelectMixedOption[]>,
			required: true,
		},
		buildingOptions: {
			type: Array as PropType<SelectMixedOption[]>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(e: "update:filterPlanet", value: string | null): void;
		(e: "update:filterBuilding", value: string | null): void;
		(e: "update:filterPositiveROI", value: boolean): void;
	}>();

	const localFilterPlanet = computed({
		get: () => props.filterPlanet,
		set: (v: string | null) => emit("update:filterPlanet", v),
	});

	const localFilterBuilding = computed({
		get: () => props.filterBuilding,
		set: (v: string | null) => emit("update:filterBuilding", v),
	});

	const localFilterPositiveROI = computed({
		get: () => props.filterPositiveROI,
		set: (v: boolean) => emit("update:filterPositiveROI", v),
	});
</script>

<template>
	<div
		class="border border-b-0 rounded-[3px] border-white/15 p-3 flex flex-row gap-3 flex-wrap justify-between">
		<div class="flex flex-row flex-wrap gap-3 child:my-auto">
			<div class="font-bold pr-3">Filter</div>
			<div class="flex flex-row gap-3 child:my-auto">
				<div>Planet</div>
				<n-select
					v-model:value="localFilterPlanet"
					:options="planetOptions"
					size="small"
					filterable
					clearable />
			</div>
			<div class="flex flex-row gap-3 child:my-auto">
				<div>Building</div>
				<n-select
					v-model:value="localFilterBuilding"
					:options="buildingOptions"
					size="small"
					filterable
					clearable />
			</div>
			<div class="flex flex-row gap-3 child:my-auto">
				<div>Positive ROI</div>
				<n-checkbox v-model:checked="localFilterPositiveROI" />
			</div>
		</div>
		<div class="flex flex-row flex-wrap gap-3 pr-3">
			<div class="my-auto font-bold">Searched Material</div>
			<div>
				<MaterialTile :ticker="searchedMaterial" />
			</div>
		</div>
	</div>
</template>
