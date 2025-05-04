<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Types & Interfaces
	import { PLAN_COGCPROGRAM_TYPE } from "@/features/planning/usePlan.types";

	// UI
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
	const localCorpHQ: Ref<boolean> = ref(props.corphq);
	const localCOGC: Ref<PLAN_COGCPROGRAM_TYPE> = ref(props.cogc);

	// Prop Watcher
	watch(
		() => props.corphq,
		(newValue: boolean) => {
			localCorpHQ.value = newValue;
		}
	);

	watch(
		() => props.cogc,
		(newValue: PLAN_COGCPROGRAM_TYPE) => {
			localCOGC.value = newValue;
		}
	);

	// Local Watcher & Emit
	watch(localCorpHQ, (newValue: boolean) => {
		emit("update:corphq", newValue);
	});

	watch(localCOGC, (newValue: PLAN_COGCPROGRAM_TYPE) => {
		emit("update:cogc", newValue);
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
	<n-form
		:disabled="disabled"
		label-placement="left"
		label-width="auto"
		label-align="left"
		size="small"
	>
		<n-form-item label="Corporation HQ">
			<n-checkbox v-model:checked="localCorpHQ" />
		</n-form-item>

		<n-form-item label="COGC">
			<n-select v-model:value="localCOGC" :options="cogcOptions" />
		</n-form-item>
	</n-form>
</template>
