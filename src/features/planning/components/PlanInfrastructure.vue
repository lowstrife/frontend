<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Types & Interfaces
	import {
		IInfrastructureRecord,
		INFRASTRUCTURE_TYPE,
	} from "@/features/planning/usePlanCalculation.types";

	// UI
	import { NForm, NFormItem, NInputNumber } from "naive-ui";

	const props = defineProps({
		disabled: {
			type: Boolean,
			required: true,
		},
		infrastructureData: {
			type: Object as PropType<IInfrastructureRecord>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(
			e: "update:infrastructure",
			infrastructure: INFRASTRUCTURE_TYPE,
			value: number
		): void;
	}>();

	// Local State
	const localInfrastructureData: Ref<IInfrastructureRecord> = ref(
		props.infrastructureData
	);

	// Prop Watcher
	watch(
		() => props.infrastructureData,
		(newData: IInfrastructureRecord) => {
			localInfrastructureData.value = newData;
		},
		{ deep: true }
	);

	const infrastructureOrder: INFRASTRUCTURE_TYPE[] = [
		"HB1",
		"HBB",
		"HB2",
		"HBC",
		"HB3",
		"HBM",
		"HB4",
		"HBL",
		"HB5",
		"STO",
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
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
			<n-form-item v-for="inf in infrastructureOrder" :key="inf" :label="inf">
				<n-input-number
					v-model:value="localInfrastructureData[inf]"
					class="w-full"
					:on-update:value="
						(value: number | null) => {
							if (value !== null) {
								emit('update:infrastructure', inf, value);
							}
						}
					"
				/>
			</n-form-item>
		</div>
	</n-form>
</template>
