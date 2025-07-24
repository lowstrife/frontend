<script setup lang="ts">
	import { computed, ComputedRef, PropType, ref, Ref } from "vue";

	// Composables
	import { useCXManagement } from "@/features/exchanges/useManageCX";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Types & Interfaces
	import { ICXDataTickerOption } from "@/stores/planningStore.types";
	import { PreferenceType } from "../manageCX.types";

	// UI
	import { NSelect, NButton, NInputNumber, NTable, NTag } from "naive-ui";
	import { PlusSharp, ClearSharp } from "@vicons/material";
	import { formatNumber } from "@/util/numbers";

	const props = defineProps({
		cxOptions: {
			type: Array as PropType<ICXDataTickerOption[]>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(e: "update:cxOptions", value: ICXDataTickerOption[]): void;
	}>();

	const localCXOptions = computed({
		get: () => props.cxOptions,
		set: (val: ICXDataTickerOption[]) => emit("update:cxOptions", val),
	});

	const {
		typeOptions,
		materialOptions,
		canAddTickerPreference,
		deleteTickerPreference,
		updateTickerPreference,
	} = useCXManagement();

	const sortedCXOptions: ComputedRef<ICXDataTickerOption[]> = computed(() => {
		return [...localCXOptions.value].sort((a, b) =>
			a.ticker > b.ticker ? 1 : -1
		);
	});

	const selectedType: Ref<PreferenceType> = ref("BOTH");
	const selectedTicker: Ref<string> = ref("DW");
	const selectedValue: Ref<number> = ref(0);
</script>

<template>
	<div class="flex flex-row gap-x-1">
		<div class="!max-w-[100px]">
			<n-select
				v-model:value="selectedType"
				:options="typeOptions"
				size="small"
				placeholder="Preference Type" />
		</div>
		<n-select
			v-model:value="selectedTicker"
			:options="materialOptions"
			filterable
			size="small"
			placeholder="Material" />
		<n-input-number
			v-model:value="selectedValue"
			:min="0"
			:precision="2"
			:show-button="false"
			size="small"
			class="!w-[300px]" />
		<n-button
			size="small"
			:disabled="
				!canAddTickerPreference(
					localCXOptions,
					selectedTicker,
					selectedType
				).value
			"
			@click="
				localCXOptions = updateTickerPreference(
					localCXOptions,
					selectedTicker,
					selectedType,
					selectedValue
				)
			">
			<template #icon><PlusSharp /></template>
		</n-button>
	</div>
	<div class="pt-3">
		<n-table striped>
			<tr
				v-for="preference in sortedCXOptions"
				:key="`${preference.type}#${preference.ticker}`">
				<td class="w-[75px]">
					<n-tag
						size="small"
						:type="
							preference.type === 'BUY'
								? 'success'
								: preference.type === 'SELL'
								? 'error'
								: 'info'
						">
						{{ preference.type }}
					</n-tag>
				</td>
				<td>
					<MaterialTile
						:key="`${preference.ticker}#${preference.type}`"
						:ticker="preference.ticker" />
				</td>
				<td class="text-right">
					{{ formatNumber(preference.value) }}
					<span class="pl-1 font-light text-white/50">$</span>
				</td>
				<td class="text-right">
					<n-button
						size="tiny"
						type="error"
						@click="
							localCXOptions = deleteTickerPreference(
								localCXOptions,
								preference.ticker,
								preference.type
							)
						">
						<template #icon><ClearSharp /></template>
					</n-button>
				</td>
			</tr>
			<tr
				v-if="localCXOptions.length === 0"
				class="text-center child:!text-white/50">
				<td colspan="4">No Ticker Preferences Configured</td>
			</tr>
		</n-table>
	</div>
</template>
