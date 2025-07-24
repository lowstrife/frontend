<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Composables
	import { usePlanetData } from "@/features/game_data/usePlanetData";

	// Utils
	import { formatNumber } from "@/util/numbers";

	// Components
	import CXExchangePreference from "@/features/exchanges/components/CXExchangePreference.vue";
	import CXTickerPreference from "@/features/exchanges/components/CXTickerPreference.vue";
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Types & Interfaces
	import { ICXPlanetMap } from "../manageCX.types";

	// UI
	import { NButton, NTag } from "naive-ui";
	import { XNDataTable, XNDataTableColumn } from "@skit/x.naive-ui";
	import { EditSharp } from "@vicons/material";

	const { getPlanetName } = usePlanetData();

	const props = defineProps({
		planetMap: {
			type: Object as PropType<ICXPlanetMap>,
			required: true,
		},
	});

	const localMap: Ref<ICXPlanetMap> = ref(props.planetMap);

	watch(
		() => props.planetMap,
		(newMap: ICXPlanetMap) => {
			localMap.value = newMap;
		}
	);

	const selectedPlanet: Ref<string | null> = ref(null);
</script>

<template>
	<h2 class="text-xl font-bold my-auto pb-3">
		Planet Preferences<span v-if="selectedPlanet"
			>: {{ getPlanetName(selectedPlanet) }}
		</span>
	</h2>
	<div
		v-if="selectedPlanet"
		class="grid grid-cols-1 xl:grid-cols-[40%_auto] gap-3 pb-3">
		<div>
			<h3 class="text-lg font-bold pb-3">Exchange</h3>
			<CXExchangePreference
				:key="`Exchanges#${selectedPlanet}`"
				v-model:cx-options="localMap[selectedPlanet].exchanges" />
		</div>
		<div>
			<h3 class="text-lg font-bold pb-3">Ticker</h3>
			<CXTickerPreference
				:key="`Ticker#${selectedPlanet}`"
				v-model:cx-options="localMap[selectedPlanet].ticker" />
		</div>
	</div>
	<XNDataTable :data="Object.values(localMap)" striped>
		<XNDataTableColumn key="buttons" title="" width="50">
			<template #render-cell="{ rowData }">
				<n-button
					size="tiny"
					:type="
						selectedPlanet === rowData.planet
							? 'success'
							: 'default'
					"
					@click="
						selectedPlanet === rowData.planet
							? (selectedPlanet = null)
							: (selectedPlanet = rowData.planet)
					">
					<template #icon><EditSharp /></template>
				</n-button>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="planet" title="Planet" sorter="default">
			<template #render-cell="{ rowData }">
				{{ getPlanetName(rowData.planet) }}
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="exchanges" title="Exchanges" max-width="20%">
			<template #render-cell="{ rowData }">
				<div class="flex flex-col gap-y-1">
					<div
						v-for="exchange in rowData.exchanges"
						:key="`${rowData.planet}#${exchange.type}#${exchange.exchange}`">
						<n-tag
							size="small"
							:type="
								exchange.type === 'BUY'
									? 'success'
									: exchange.type === 'SELL'
									? 'error'
									: 'info'
							">
							{{ exchange.type }}:
							<strong>{{ exchange.exchange }}</strong>
						</n-tag>
					</div>
				</div>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="ticker" title="Ticker" max-width="50%">
			<template #render-cell="{ rowData }">
				<div class="flex flex-wrap gap-3">
					<div
						v-for="ticker in rowData.ticker"
						:key="`${rowData.planet}#${ticker.type}#${ticker.value}`"
						class="flex flex-row gap-x-1">
						<MaterialTile :ticker="ticker.ticker" />
						<n-tag
							size="small"
							:type="
								ticker.type === 'BUY'
									? 'success'
									: ticker.type === 'SELL'
									? 'error'
									: 'info'
							">
							{{ ticker.type }}:
							<strong>{{ formatNumber(ticker.value) }}</strong>
							<span class="pl-1 font-light opacity-50">$</span>
						</n-tag>
					</div>
				</div>
			</template>
		</XNDataTableColumn>
	</XNDataTable>
</template>
