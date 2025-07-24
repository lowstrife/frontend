<script setup lang="ts">
	import { computed, PropType, ref, Ref } from "vue";

	// Composables
	import { useCXManagement } from "@/features/exchanges/useManageCX";

	// Types & Interfaces
	import { ICXDataExchangeOption } from "@/stores/planningStore.types";
	import { ExchangeType, PreferenceType } from "../manageCX.types";

	// UI
	import { NSelect, NButton, NTable, NTag } from "naive-ui";
	import { PlusSharp, ClearSharp } from "@vicons/material";

	const props = defineProps({
		cxOptions: {
			type: Array as PropType<ICXDataExchangeOption[]>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(e: "update:cxOptions", value: ICXDataExchangeOption[]): void;
	}>();

	const localCXOptions = computed({
		get: () => props.cxOptions,
		set: (val: ICXDataExchangeOption[]) => emit("update:cxOptions", val),
	});

	const {
		typeOptions,
		exchangeOptions,
		canAddExchangePreference,
		updateExchangePreference,
		deleteExchangePreference,
	} = useCXManagement();

	const selectedType: Ref<PreferenceType> = ref("BOTH");
	const selectedExchange: Ref<ExchangeType> = ref("PP30D_UNIVERSE");
</script>

<template>
	<div class="flex flex-row gap-x-1">
		<div class="!min-w-[100px]">
			<n-select
				v-model:value="selectedType"
				:options="typeOptions"
				size="small"
				placeholder="Preference Type"
				class="w-full" />
		</div>
		<n-select
			v-model:value="selectedExchange"
			:options="exchangeOptions"
			size="small"
			placeholder="Exchange" />
		<n-button
			size="small"
			:disabled="
				!canAddExchangePreference(localCXOptions, selectedType).value
			"
			@click="
				localCXOptions = updateExchangePreference(
					localCXOptions,
					selectedType,
					selectedExchange
				)
			">
			<template #icon><PlusSharp /></template>
		</n-button>
	</div>
	<div class="pt-3">
		<n-table striped>
			<tr
				v-for="preference in localCXOptions"
				:key="`${preference.type}#${preference.exchange}`">
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
				<td>{{ preference.exchange }}</td>
				<td class="text-right">
					<n-button
						size="tiny"
						type="error"
						@click="
							localCXOptions = deleteExchangePreference(
								localCXOptions,
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
				<td colspan="3">No Exchange Preference Configured</td>
			</tr>
		</n-table>
	</div>
</template>
