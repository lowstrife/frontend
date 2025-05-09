<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Types & Interfaces
	import { IMaterialIO } from "@/features/planning/usePlanCalculation.types";

	// Util
	import { formatNumber } from "@/util/numbers";

	// UI
	import { NTable } from "naive-ui";

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
	<n-table striped>
		<thead>
			<tr>
				<th class="!text-left">Ticker</th>
				<th class="!text-center">Input</th>
				<th class="!text-center">Output</th>
				<th class="!text-center">Δ</th>
				<th class="!text-end" v-if="!localShowBasked">$ / day</th>
				<th class="!text-center" v-if="localShowBasked">Δ t</th>
				<th class="!text-center" v-if="localShowBasked">Δ m³</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="material in localMaterialIOData"
				:key="`IO#${material.ticker}`"
				class="child:text-center child:first:text-left"
			>
				<td>
					<MaterialTile :ticker="material.ticker" :disable-drawer="false" />
				</td>
				<td :class="material.input === 0 ? '!text-white/20' : ''">
					{{ formatNumber(material.input) }}
				</td>
				<td :class="material.output === 0 ? '!text-white/20' : ''">
					{{ formatNumber(material.output) }}
				</td>
				<td :class="material.delta > 0 ? '!text-positive' : '!text-negative'">
					{{ formatNumber(material.delta) }}
				</td>
				<td
					v-if="!localShowBasked"
					class="!text-end"
					:class="material.price > 0 ? '!text-positive' : '!text-negative'"
				>
					{{ formatNumber(material.price) }}
				</td>
				<td
					v-if="localShowBasked"
					:class="
						material.totalWeight > 0 ? '!text-positive' : '!text-negative'
					"
				>
					{{ formatNumber(material.totalWeight) }}
				</td>
				<td
					v-if="localShowBasked"
					:class="
						material.totalVolume > 0 ? '!text-positive' : '!text-negative'
					"
				>
					{{ formatNumber(material.totalVolume) }}
				</td>
			</tr>
		</tbody>
	</n-table>
</template>
