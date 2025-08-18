<script setup lang="ts">
	import { computed, PropType, WritableComputedRef } from "vue";

	// Types & Interfaces
	import { PLAN_COGCPROGRAM_TYPE } from "@/stores/planningStore.types";

	// UI
	import { PForm, PFormItem, PCheckbox } from "@/ui";
	import { NForm, NFormItem, NCheckbox, NSelect } from "naive-ui";
	import { SelectMixedOption } from "naive-ui/es/select/src/interface";

	const props = defineProps({
		disabled: {
			type: Boolean,
			required: true,
		},
		corphq: {
			type: Boolean,
			required: true,
		},
		cogc: {
			type: String as PropType<PLAN_COGCPROGRAM_TYPE>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(e: "update:corphq", value: boolean): void;
		(e: "update:cogc", value: PLAN_COGCPROGRAM_TYPE): void;
	}>();

	// Local State
	const localCorpHQ: WritableComputedRef<boolean> = computed({
		get: () => props.corphq,
		set: (value: boolean) => emit("update:corphq", value),
	});

	const localCOGC: WritableComputedRef<PLAN_COGCPROGRAM_TYPE> = computed({
		get: () => props.cogc,
		set: (value: PLAN_COGCPROGRAM_TYPE) => emit("update:cogc", value),
	});

	const cogcOptions: SelectMixedOption[] = [
		{ value: "---", label: "None" },
		{ value: "AGRICULTURE", label: "Agriculture" },
		{ value: "CHEMISTRY", label: "Chemistry" },
		{ value: "CONSTRUCTION", label: "Construction" },
		{ value: "ELECTRONICS", label: "Electronics" },
		{ value: "FOOD_INDUSTRIES", label: "Food Industries" },
		{ value: "FUEL_REFINING", label: "Fuel Refining" },
		{ value: "MANUFACTURING", label: "Manufacturing" },
		{ value: "METALLURGY", label: "Metallurgy" },
		{ value: "RESOURCE_EXTRACTION", label: "Resource Extraction" },
		{ value: "PIONEERS", label: "Pioneers" },
		{ value: "SETTLERS", label: "Settlers" },
		{ value: "TECHNICIANS", label: "Technicians" },
		{ value: "ENGINEERS", label: "Engineers" },
		{ value: "SCIENTISTS", label: "Scientists" },
	];
</script>

<template>
	<PForm>
		<PFormItem label="Corp. HQ">
			<n-checkbox :disabled="disabled" v-model:checked="localCorpHQ" />
		</PFormItem>

		<PFormItem label="COGC">
			<n-select
				size="small"
				:disabled="disabled"
				v-model:value="localCOGC"
				:options="cogcOptions" />
		</PFormItem>
	</PForm>
</template>
