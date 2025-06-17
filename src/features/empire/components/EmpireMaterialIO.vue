<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Composables
	import { usePlanetData } from "@/features/game_data/usePlanetData";
	const { getPlanetName } = usePlanetData();

	// Util
	import { formatNumber } from "@/util/numbers";
	import { inertClone } from "@/util/data";

	// Types & Interfaces
	import { IEmpireMaterialIO } from "@/features/empire/empire.types";
	import { SelectMixedOption } from "naive-ui/es/select/src/interface";
	import { WORKFORCE_CONSUMPTION_MAP } from "@/features/planning/calculations/workforceCalculations";

	// UI
	import {
		NForm,
		NFormItem,
		NTooltip,
		NSelect,
		NButton,
		NButtonGroup,
	} from "naive-ui";
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
	const refMaterialSelectOptions: Ref<SelectMixedOption[]> = ref([]);
	const refFilterMaterials: Ref<string[]> = ref([]);
	const refPlanetSelectOptions: Ref<SelectMixedOption[]> = ref([]);
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
	<div class="mb-3 pt-3 pb-2 px-3 border rounded-[3px] border-white/10">
		<n-form
			label-placement="left"
			label-width="auto"
			label-align="left"
			size="small">
			<div class="flex flex-row gap-x-6">
				<div>
					<n-form-item label="Display">
						<n-button-group>
							<n-button
								:secondary="refFilterLoadbalance"
								@click="
									() => {
										refFilterLoadbalance =
											!refFilterLoadbalance;
										applyFilter();
									}
								">
								All
							</n-button>
							<n-button
								:secondary="!refFilterLoadbalance"
								@click="
									() => {
										refFilterLoadbalance =
											!refFilterLoadbalance;
										applyFilter();
									}
								">
								Loadbalance
							</n-button>
						</n-button-group>
					</n-form-item>
					<n-form-item label="Consumables">
						<n-button-group>
							<n-button
								:secondary="refFilterHideConsumables"
								@click="
									() => {
										refFilterHideConsumables =
											!refFilterHideConsumables;
										applyFilter();
									}
								">
								Show
							</n-button>
							<n-button
								:secondary="!refFilterHideConsumables"
								@click="
									() => {
										refFilterHideConsumables =
											!refFilterHideConsumables;
										applyFilter();
									}
								">
								Hide
							</n-button>
						</n-button-group>
					</n-form-item>
				</div>
				<div class="flex-grow">
					<n-form-item label="Materials">
						<n-select
							v-model:value="refFilterMaterials"
							multiple
							filterable
							clearable
							:options="refMaterialSelectOptions"
							@update:value="applyFilter" />
					</n-form-item>
					<n-form-item label="Planets">
						<n-select
							v-model:value="refFilterPlanets"
							multiple
							filterable
							clearable
							:options="refPlanetSelectOptions"
							@update:value="applyFilter" />
					</n-form-item>
				</div>
			</div>
		</n-form>
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
					:class="
						rowData.delta >= 0 ? 'text-positive' : 'text-negative'
					">
					{{ formatNumber(rowData.delta) }}
				</span>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column key="output" title="Production" sorter="default">
			<template #render-cell="{ rowData }">
				<span :class="rowData.output <= 0 ? 'text-white/50' : ''">
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
					<n-tooltip trigger="hover">
						<template #trigger>
							<router-link
								:to="`/plan/${p.planetId}/${p.planUuid}`"
								class="hover:underline">
								{{ getPlanetName(p.planetId) }}:
								{{ formatNumber(p.value) }}
							</router-link>
						</template>
						{{ p.planName }}
					</n-tooltip>
				</div>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column key="inputPlanets" title="Consumption Planets">
			<template #render-cell="{ rowData }">
				<div
					v-for="p in rowData.inputPlanets"
					:key="`${rowData.ticker}#input#${p.planUuid}`">
					<n-tooltip trigger="hover">
						<template #trigger>
							<router-link
								:to="`/plan/${p.planetId}/${p.planUuid}`"
								class="hover:underline">
								{{ getPlanetName(p.planetId) }}:
								{{ formatNumber(p.value * -1) }}
							</router-link>
						</template>
						{{ p.planName }}
					</n-tooltip>
				</div>
			</template>
		</x-n-data-table-column>
	</x-n-data-table>
</template>
