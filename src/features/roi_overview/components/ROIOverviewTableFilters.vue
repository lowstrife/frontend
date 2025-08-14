<script setup lang="ts">
	import { computed, PropType } from "vue";

	// Types & Interfaces
	import { SelectMixedOption } from "naive-ui/es/select/src/interface";

	// UI
	import { NSelect, NCheckbox } from "naive-ui";

	const props = defineProps({
		filterBuilding: {
			type: null as unknown as PropType<string | null>,
			required: false,
			default: null,
		},
		filterCogc: {
			type: null as unknown as PropType<string | null>,
			required: false,
			default: null,
		},
		filterOutputMaterial: {
			type: null as unknown as PropType<string | null>,
			required: false,
			default: null,
		},
		filterInputMaterial: {
			type: null as unknown as PropType<string | null>,
			required: false,
			default: null,
		},
		filterPositiveROI: {
			type: Boolean,
			required: true,
		},
		buildingOptions: {
			type: Array as PropType<SelectMixedOption[]>,
			required: true,
		},
		cogcOptions: {
			type: Array as PropType<SelectMixedOption[]>,
			required: true,
		},
		outputMaterialOptions: {
			type: Array as PropType<SelectMixedOption[]>,
			required: true,
		},
		inputMaterialOptions: {
			type: Array as PropType<SelectMixedOption[]>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(e: "update:filterBuilding", value: string | null): void;
		(e: "update:filterCogc", value: string | null): void;
		(e: "update:filterOutputMaterial", value: string | null): void;
		(e: "update:filterInputMaterial", value: string | null): void;
		(e: "update:filterPositiveROI", value: boolean): void;
	}>();

	const localFilterBuilding = computed({
		get: () => props.filterBuilding,
		set: (v: string | null) => emit("update:filterBuilding", v),
	});
	const localFilterCogc = computed({
		get: () => props.filterCogc,
		set: (v: string | null) => emit("update:filterCogc", v),
	});
	const localFilterOutputMaterial = computed({
		get: () => props.filterOutputMaterial,
		set: (v: string | null) => emit("update:filterOutputMaterial", v),
	});
	const localFilterInputMaterial = computed({
		get: () => props.filterInputMaterial,
		set: (v: string | null) => emit("update:filterInputMaterial", v),
	});
	const localFilterPositiveROI = computed({
		get: () => props.filterPositiveROI,
		set: (v: boolean) => emit("update:filterPositiveROI", v),
	});
</script>

<template>
	<div
		class="border border-b-0 rounded-[3px] border-white/15 p-3 flex flex-row gap-3 flex-wrap">
		<div class="my-auto font-bold pr-3">Filter</div>
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
			<div>COGC</div>
			<n-select
				v-model:value="localFilterCogc"
				:options="cogcOptions"
				size="small"
				filterable
				clearable />
		</div>
		<div class="flex flex-row gap-3 child:my-auto">
			<div>Output</div>
			<n-select
				v-model:value="localFilterOutputMaterial"
				:options="outputMaterialOptions"
				size="small"
				filterable
				clearable />
		</div>
		<div class="flex flex-row gap-3 child:my-auto">
			<div>Input</div>
			<n-select
				v-model:value="localFilterInputMaterial"
				:options="inputMaterialOptions"
				size="small"
				filterable
				clearable />
		</div>
		<div class="flex flex-row gap-3 child:my-auto">
			<div>Positive ROI</div>
			<n-checkbox v-model:checked="localFilterPositiveROI" />
		</div>
	</div>
</template>
