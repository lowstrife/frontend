<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Types & Interfaces
	import { IMaterialIO } from "@/features/planning/usePlanCalculation.types";

	// Util
	import { formatNumber } from "@/util/numbers";

	// UI
	import { XNDataTable, XNDataTableColumn } from "@skit/x.naive-ui";

	const props = defineProps({
		materialIOData: {
			type: Array as PropType<IMaterialIO[]>,
			required: true,
		},
		showBasked: {
			type: Boolean,
			required: true,
		},
	});

	// Local State
	const localMaterialIOData: Ref<IMaterialIO[]> = ref(props.materialIOData);
	const localShowBasked: Ref<boolean> = ref(props.showBasked);

	// Prop Watcher
	watch(
		() => props.materialIOData,
		(newData: IMaterialIO[]) => {
			localMaterialIOData.value = newData;
		},
		{ deep: true }
	);

	watch(
		() => props.showBasked,
		(newState: boolean) => {
			localShowBasked.value = newState;
		}
	);
</script>

<template>
	<XNDataTable :data="localMaterialIOData" striped>
		<XNDataTableColumn key="ticker" title="Ticker" sorter="default">
			<template #render-cell="{ rowData }">
				<MaterialTile
					:ticker="rowData.ticker"
					:disable-drawer="false" />
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="input" title="Input" sorter="default">
			<template #render-cell="{ rowData }">
				<span :class="rowData.input === 0 ? 'text-white/20' : ''">
					{{ formatNumber(rowData.input) }}
				</span>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="output" title="Output" sorter="default">
			<template #render-cell="{ rowData }">
				<span :class="rowData.output === 0 ? 'text-white/20' : ''">
					{{ formatNumber(rowData.output) }}
				</span>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="delta" title="Δ" sorter="default">
			<template #render-cell="{ rowData }">
				<span
					:class="
						rowData.delta > 0 ? 'text-positive' : 'text-negative'
					">
					{{ formatNumber(rowData.delta) }}
				</span>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn
			v-if="!localShowBasked"
			key="price"
			title="$ / day"
			sorter="default">
			<template #render-cell="{ rowData }">
				<span
					:class="
						rowData.price > 0 ? 'text-positive' : 'text-negative'
					">
					{{ formatNumber(rowData.price) }}
				</span>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn
			v-if="localShowBasked"
			key="totalWeight"
			title="Δ t"
			sorter="default">
			<template #render-cell="{ rowData }">
				<span
					:class="
						rowData.totalWeight > 0
							? 'text-positive'
							: 'text-negative'
					">
					{{ formatNumber(rowData.totalWeight) }}
				</span>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn
			v-if="localShowBasked"
			key="totalVolume"
			title="Δ m³"
			sorter="default">
			<template #render-cell="{ rowData }">
				<span
					:class="
						rowData.totalVolume > 0
							? 'text-positive'
							: 'text-negative'
					">
					{{ formatNumber(rowData.totalVolume) }}
				</span>
			</template>
		</XNDataTableColumn>
	</XNDataTable>
</template>
