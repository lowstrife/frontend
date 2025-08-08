<script setup lang="ts">
	import { computed, PropType, WritableComputedRef } from "vue";

	// Types & Interfaces
	import { IAreaResult } from "@/features/planning/usePlanCalculation.types";

	// UI
	import { NForm, NFormItem, NInputNumber } from "naive-ui";

	const props = defineProps({
		disabled: {
			type: Boolean,
			required: true,
		},
		areaData: {
			type: Object as PropType<IAreaResult>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(e: "update:permits", value: number): void;
	}>();

	// Local State
	const localPermits: WritableComputedRef<number> = computed({
		get: () => props.areaData.permits,
		set: (value: number) => emit("update:permits", value),
	});
</script>

<template>
	<n-form
		:disabled="disabled"
		label-placement="left"
		label-width="auto"
		label-align="left"
		size="small">
		<n-form-item label="Permits">
			<n-input-number
				v-model:value="localPermits"
				class="text-center"
				button-placement="both"
				:min="1"
				:max="3" />
		</n-form-item>
		<n-form-item label="Area">
			<div class="flex flex-row w-full">
				<div class="flex-grow">
					{{ areaData.areaUsed }} / {{ areaData.areaTotal }}
				</div>
				<div>
					<span
						class="font-bold"
						:class="
							areaData.areaLeft >= 0
								? 'text-positive'
								: 'text-negative'
						"
						>{{ areaData.areaLeft }}</span
					>
					Free
				</div>
			</div>
		</n-form-item>
	</n-form>
</template>
