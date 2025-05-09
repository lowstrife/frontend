<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Utils
	import { capitalizeString } from "@/util/text";
	import { formatAmount, formatNumber } from "@/util/numbers";

	// Types & Interfaces
	import {
		IWorkforceRecord,
		WORKFORCE_TYPE,
	} from "@/features/planning/usePlanCalculation.types";

	// UI
	import { NTable, NButton } from "naive-ui";
	import { CheckSharp, RadioButtonUncheckedSharp } from "@vicons/material";

	const props = defineProps({
		disabled: {
			type: Boolean,
			required: true,
		},
		workforceData: {
			type: Object as PropType<IWorkforceRecord>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(
			e: "update:lux",
			workforce: WORKFORCE_TYPE,
			luxType: "lux1" | "lux2",
			value: boolean
		): void;
	}>();

	// Local State
	const localWorkforceData: Ref<IWorkforceRecord> = ref(props.workforceData);

	// Prop Watcher
	watch(
		() => props.workforceData,
		(newData: IWorkforceRecord) => {
			localWorkforceData.value = newData;
		},
		{ deep: true }
	);
</script>

<template>
	<n-table striped>
		<thead>
			<tr>
				<th>Type</th>
				<th>Required</th>
				<th>Capacity</th>
				<th>Open</th>
				<th>Lux 1</th>
				<th>Lux 2</th>
				<th>Efficiency</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="workforce in localWorkforceData" :key="workforce.name">
				<td class="font-bold">{{ capitalizeString(workforce.name) }}</td>
				<td :class="workforce.required === 0 ? '!text-white/50' : ''">
					{{ formatAmount(workforce.required) }}
				</td>
				<td :class="workforce.capacity === 0 ? '!text-white/50' : ''">
					{{ formatAmount(workforce.capacity) }}
				</td>
				<td :class="workforce.left === 0 ? '!text-white/50' : ''">
					{{ formatAmount(workforce.left) }}
				</td>
				<td>
					<n-button
						v-if="workforce.lux1"
						:disabled="disabled"
						size="tiny"
						type="success"
						@click="
							() => emit('update:lux', workforce.name, 'lux1', !workforce.lux1)
						"
					>
						<template #icon>
							<CheckSharp />
						</template>
					</n-button>
					<n-button
						v-else
						:disabled="disabled"
						size="tiny"
						type="error"
						@click="
							() => emit('update:lux', workforce.name, 'lux1', !workforce.lux1)
						"
					>
						<template #icon>
							<RadioButtonUncheckedSharp />
						</template>
					</n-button>
				</td>
				<td>
					<n-button
						v-if="workforce.lux2"
						:disabled="disabled"
						size="tiny"
						type="success"
						@click="
							() => emit('update:lux', workforce.name, 'lux2', !workforce.lux2)
						"
					>
						<template #icon>
							<CheckSharp />
						</template>
					</n-button>
					<n-button
						v-else
						:disabled="disabled"
						size="tiny"
						type="error"
						@click="
							() => emit('update:lux', workforce.name, 'lux2', !workforce.lux2)
						"
					>
						<template #icon>
							<RadioButtonUncheckedSharp />
						</template>
					</n-button>
				</td>
				<td :class="workforce.efficiency === 0 ? '!text-white/50' : ''">
					{{ formatNumber(workforce.efficiency * 100) }} %
				</td>
			</tr>
		</tbody>
	</n-table>
</template>
