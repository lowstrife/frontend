<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Components
	import EmpireMaterialIOFilters from "@/features/empire/components/EmpireMaterialIOFilters.vue";
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Composables
	import { usePlanetData } from "@/features/game_data/usePlanetData";
	const { getPlanetName } = usePlanetData();

	// Util
	import { formatNumber } from "@/util/numbers";
	import { inertClone } from "@/util/data";

	// Types & Interfaces
	import { IEmpireMaterialIO } from "@/features/empire/empire.types";
	import { PSelectOption } from "@/ui/ui.types";
	import { WORKFORCE_CONSUMPTION_MAP } from "@/features/planning/calculations/workforceCalculations";

	// UI
	import { XNDataTable, XNDataTableColumn } from "@skit/x.naive-ui";

	const props = defineProps({
		empireMaterialIO: {
			type: Array as PropType<IEmpireMaterialIO[]>,
			required: true,
		},
	});

	// Local State
	const localEmpireMaterialIO: Ref<IEmpireMaterialIO[]> = ref(
		props.empireMaterialIO
	);

	const workforceMaterial: string[] = [
		...new Set(
			Object.values(WORKFORCE_CONSUMPTION_MAP)
				.flat()
				.map((wm) => wm.ticker)
		),
	];

	const filteredMaterialIO: Ref<IEmpireMaterialIO[]> = ref([]);
	const refMaterialSelectOptions: Ref<PSelectOption[]> = ref([]);
	const refFilterMaterials: Ref<string[]> = ref([]);
	const refPlanetSelectOptions: Ref<PSelectOption[]> = ref([]);
	const refFilterPlanets: Ref<string[]> = ref([]);
	const refFilterLoadbalance: Ref<boolean> = ref(false);
	const refFilterHideConsumables: Ref<boolean> = ref(false);

	// call initial filter option creation and data preparation
	createFilter();
	applyFilter();

	// Prop Watcher
	watch(
		() => props.empireMaterialIO,
		(newData: IEmpireMaterialIO[]) => {
			localEmpireMaterialIO.value = newData;
			createFilter();
			applyFilter();
		}
	);

	/**
	 * Creates filter options based on material i/o data
	 * @author jplacht
	 *
	 * @returns {void}
	 */
	function createFilter(): void {
		refMaterialSelectOptions.value = localEmpireMaterialIO.value.map(
			(m) => {
				return {
					label: m.ticker,
					value: m.ticker,
				};
			}
		);

		let availPlanetIds: string[] = [];

		localEmpireMaterialIO.value.map((p) => {
			availPlanetIds = availPlanetIds.concat(
				p.inputPlanets
					.flat()
					.filter((v) => v)
					.map((pm) => pm.planetId),
				p.outputPlanets
					.flat()
					.filter((v) => v)
					.map((pm) => pm.planetId)
			);
		});

		refPlanetSelectOptions.value = [...new Set(availPlanetIds)].map((o) => {
			return {
				label: getPlanetName(o),
				value: o,
			};
		});
	}

	/**
	 * Applies filter set by user to data
	 * @author jplacht
	 *
	 * @returns {void}
	 */
	function applyFilter(): void {
		filteredMaterialIO.value = inertClone(localEmpireMaterialIO.value);

		// material
		if (refFilterMaterials.value.length > 0) {
			filteredMaterialIO.value = filteredMaterialIO.value.filter((m) =>
				refFilterMaterials.value.includes(m.ticker)
			);
		}

		// planets
		if (refFilterPlanets.value.length > 0) {
			filteredMaterialIO.value = filteredMaterialIO.value.filter((p) => {
				const inputFlat = p.inputPlanets.flat().map((i) => i.planetId);
				const outputFlat = p.outputPlanets
					.flat()
					.map((o) => o.planetId);

				return (
					inputFlat.some((r) =>
						refFilterPlanets.value.flat().includes(r)
					) ||
					outputFlat.some((r) =>
						refFilterPlanets.value.flat().includes(r)
					)
				);
			});
		}

		// loadbalance
		if (refFilterLoadbalance.value) {
			filteredMaterialIO.value = filteredMaterialIO.value.filter(
				(lb) => lb.input != 0 && lb.output != 0
			);
		}

		// consumables
		if (refFilterHideConsumables.value) {
			filteredMaterialIO.value = filteredMaterialIO.value.filter(
				(m) => !workforceMaterial.includes(m.ticker)
			);
		}
	}
</script>

<template>
	<div class="border border-b-0 rounded-[3px] border-white/15 p-3">
		<EmpireMaterialIOFilters
			v-model:load-balance="refFilterLoadbalance"
			v-model:hide-consumables="refFilterHideConsumables"
			v-model:filter-materials="refFilterMaterials"
			v-model:filter-planets="refFilterPlanets"
			:material-options="refMaterialSelectOptions"
			:planet-options="refPlanetSelectOptions"
			@apply-filter="applyFilter" />
	</div>
	<x-n-data-table :data="filteredMaterialIO" striped>
		<x-n-data-table-column key="ticker" title="Ticker" sorter="default">
			<template #render-cell="{ rowData }">
				<MaterialTile :ticker="rowData.ticker" />
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column key="delta" title="Delta" sorter="default">
			<template #render-cell="{ rowData }">
				<span
					class="text-nowrap"
					:class="
						rowData.delta >= 0 ? 'text-positive' : 'text-negative'
					">
					{{ formatNumber(rowData.delta) }}
				</span>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column key="output" title="Production" sorter="default">
			<template #render-cell="{ rowData }">
				<span
					class="text-nowrap"
					:class="rowData.output <= 0 ? 'text-white/50' : ''">
					{{ formatNumber(rowData.output) }}
				</span>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column key="input" title="Consumption" sorter="default">
			<template #render-cell="{ rowData }">
				<span :class="rowData.input <= 0 ? 'text-white/50' : ''">
					{{ formatNumber(rowData.input) }}
				</span>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column
			key="deltaPrice"
			title="$ Delta"
			sorter="default">
			<template #render-cell="{ rowData }">
				<span
					class="text-nowrap"
					:class="
						rowData.deltaPrice >= 0
							? 'text-positive'
							: 'text-negative'
					">
					{{ formatNumber(rowData.deltaPrice) }}
				</span>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column key="outputPlanets" title="Production Planets">
			<template #render-cell="{ rowData }">
				<div
					v-for="p in rowData.outputPlanets"
					:key="`${rowData.ticker}#output#${p.planUuid}`">
					<router-link
						:to="`/plan/${p.planetId}/${p.planUuid}`"
						class="hover:underline">
						{{ getPlanetName(p.planetId) }}:
						<strong>
							{{ formatNumber(p.output) }}
						</strong>
					</router-link>
				</div>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column key="inputPlanets" title="Consumption Planets">
			<template #render-cell="{ rowData }">
				<div
					v-for="p in rowData.inputPlanets"
					:key="`${rowData.ticker}#input#${p.planUuid}`">
					<router-link
						:to="`/plan/${p.planetId}/${p.planUuid}`"
						class="hover:underline">
						{{ getPlanetName(p.planetId) }}:
						<strong>
							{{ formatNumber(p.input) }}
						</strong>
					</router-link>
				</div>
			</template>
		</x-n-data-table-column>
	</x-n-data-table>
</template>
