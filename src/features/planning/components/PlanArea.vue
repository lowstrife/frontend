<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

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
	const localPermits: Ref<number> = ref(props.areaData.permits);

	// Prop Watcher
	watch(
		() => props.areaData.permits,
		(newPermits: number) => {
			localPermits.value = newPermits;
		}
	);

	// Local Watcher & Emit
	watch(localPermits, (newPermits: number) => {
		emit("update:permits", newPermits);
	});
</script>

<template>
	<n-form
		:disabled="disabled"
		label-placement="left"
		label-width="auto"
		label-align="left"
		size="small"
	>
		<n-form-item label="Permits">
			<n-input-number
				class="text-center"
				v-model:value="localPermits"
				button-placement="both"
				:min="1"
				:max="3"
			/>
		</n-form-item>
		<n-form-item label="Area">
			<div class="flex flex-row w-full">
				<div class="flex-grow">
					{{ areaData.areaUsed }} / {{ areaData.areaTotal }}
				</div>
				<div>
					<span
						class="font-bold"
						:class="areaData.areaLeft >= 0 ? 'text-positive' : 'text-negative'"
						>{{ areaData.areaLeft }}</span
					>
					Free
				</div>
			</div>
		</n-form-item>
	</n-form>
</template>
