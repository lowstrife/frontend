<script setup lang="ts">
	import { computed } from "vue";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Util
	import { formatNumber } from "@/util/numbers";

	// Types & Interfaces
	import { IGovUpkeepPrice } from "@/features/government/useUpkeepPrice.types";

	// UI
	import { NTable } from "naive-ui";

	const props = defineProps<{ data: IGovUpkeepPrice }>();

	const localData = computed(() => props.data);
</script>

<template>
	<h2 class="text-lg font-bold pb-1">{{ localData.effect }}</h2>
	<n-table striped>
		<thead>
			<tr></tr>
			<tr>
				<th colspan="2" class="!font-normal">
					Best
					<span class="!font-bold">{{ localData.effect }}</span>
					Material
				</th>
				<th class="!text-end">
					<MaterialTile :ticker="localData.minMaterial" />
				</th>
				<th class="!text-end">{{ localData.minBuilding }}</th>
				<th class="!text-end font-bold">
					{{ formatNumber(localData.minPricePerEffect, 4) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</th>
			</tr>
			<tr>
				<th>Material</th>
				<th>Building</th>
				<th class="!text-end">$ / Effect</th>
				<th class="!text-end">Price</th>
				<th class="!text-end">Rel. Price</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="element in localData.data"
				:key="`${element.building}#${element.material}`">
				<td><MaterialTile :ticker="element.material" /></td>
				<td>{{ element.building }}</td>
				<td class="text-end">
					{{ formatNumber(element.pricePerEffect, 4) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</td>
				<td class="text-end">
					{{ formatNumber(element.materialPrice, 2) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</td>
				<td class="text-end">
					{{ formatNumber(element.priceRelative, 2) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</td>
			</tr>
		</tbody>
	</n-table>
</template>
