<script setup lang="ts">
	import { computed, ComputedRef, PropType } from "vue";

	// Composables
	import { usePlanetSearchResults } from "../usePlanetSearchResults";

	// Util
	import { formatNumber } from "@/util/numbers";
	import { capitalizeString } from "@/util/text";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";
	import PlanetPOPRButton from "@/features/government/components/PlanetPOPRButton.vue";

	// Types & Interfaces
	import { IPlanet } from "@/features/api/gameData.types";
	import { IPlanetSearchResult } from "../usePlanetSearchResults.types";

	// UI
	import { NButton, NTooltip } from "naive-ui";
	import { XNDataTable, XNDataTableColumn } from "@skit/x.naive-ui";
	import { PlusSharp } from "@vicons/material";

	const props = defineProps({
		results: {
			type: Array as PropType<IPlanet[]>,
			required: true,
		},
		searchMaterials: {
			type: Array as PropType<string[]>,
			required: true,
		},
	});

	// Local State
	const localSearchMaterials: ComputedRef<string[]> = computed(
		() => props.searchMaterials
	);

	const planetSearch: ComputedRef<{
		results: ComputedRef<IPlanetSearchResult[]>;
		hasCheckDistance: ComputedRef<string | null>;
	}> = computed(() =>
		usePlanetSearchResults(props.results, localSearchMaterials.value)
	);

	const localResults: ComputedRef<IPlanetSearchResult[]> = computed(
		() => planetSearch.value.results.value
	);
	const localCheckDistances: ComputedRef<string | null> = computed(
		() => planetSearch.value.hasCheckDistance.value
	);
</script>

<template>
	<XNDataTable :data="localResults" striped :pagination="{ pageSize: 50 }">
		<XNDataTableColumn key="Plan" title="Plan" width="50">
			<template #render-cell="{ rowData }">
				<router-link :to="`/plan/${rowData.planetId}`">
					<n-button size="tiny">
						<template #icon>
							<PlusSharp />
						</template>
					</n-button>
				</router-link>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="planetName" title="Planet" sorter="default">
			<template #render-cell="{ rowData }">
				<span
					v-if="rowData.planetName === rowData.planetId"
					class="!font-bold">
					{{ rowData.planetId }}
				</span>
				<span v-else class="!font-bold">
					{{ rowData.planetName }} ({{ rowData.planetId }})
				</span>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="fertility" title="Fertility" sorter="default">
			<template #render-cell="{ rowData }">
				<span v-if="rowData.fertility === 0">&mdash;</span>
				<span v-else>
					{{ formatNumber(rowData.fertility * 100) }} %
				</span>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn
			v-for="sm in localSearchMaterials"
			:key="`Search#${sm}`"
			:title="sm"
			:sorter="{
				compare: (row1, row2) =>
					// @ts-expect-error naive-ui row typing
					row1.searchResources[sm].dailyExtraction -
					// @ts-expect-error naive-ui row typing
					row2.searchResources[sm].dailyExtraction,
				multiple: 1,
			}">
			<template #render-cell="{ rowData }">
				<MaterialTile
					:ticker="rowData.searchResources[sm].ticker"
					:amount="rowData.searchResources[sm].dailyExtraction"
					:max="rowData.searchResources[sm].maxExtraction" />
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="additionalResources" title="Resources">
			<template #render-cell="{ rowData }">
				<div
					v-for="am in rowData.additionalResources"
					:key="am.ticker"
					class="inline pr-1">
					<MaterialTile
						:ticker="am.ticker"
						:amount="am.dailyExtraction"
						:max="am.maxExtraction" />
				</div>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="popr" title="POPR">
			<template #render-cell="{ rowData }">
				<PlanetPOPRButton
					:planet-natural-id="rowData.planetId"
					button-size="tiny" />
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn
			key="cogcProgram"
			title="COGC Program"
			sorter="default">
			<template #render-cell="{ rowData }">
				{{
					capitalizeString(rowData.cogcProgram)
						.replace("Advertising ", "")
						.replace("Workforce ", "")
				}}
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="environment" title="Environment">
			<template #render-cell="{ rowData }">
				<div class="flex flex-row gap-x-1">
					<n-tooltip v-if="rowData.environmentSurface.length !== 0">
						<template #trigger>
							<div>
								<MaterialTile
									:ticker="rowData.environmentSurface[0]" />
							</div>
						</template>
						Surface
					</n-tooltip>
					<n-tooltip v-if="rowData.environmentGravity.length !== 0">
						<template #trigger>
							<div>
								<MaterialTile
									:ticker="rowData.environmentGravity[0]" />
							</div>
						</template>
						Gravity
					</n-tooltip>
					<n-tooltip
						v-if="rowData.environmentTemperature.length !== 0">
						<template #trigger>
							<div>
								<MaterialTile
									:ticker="
										rowData.environmentTemperature[0]
									" />
							</div>
						</template>
						Temperature
					</n-tooltip>
					<n-tooltip v-if="rowData.environmentPressure.length !== 0">
						<template #trigger>
							<div>
								<MaterialTile
									:ticker="rowData.environmentPressure[0]" />
							</div>
						</template>
						Pressure
					</n-tooltip>
				</div>
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn key="infrastructures" title="Infrastructure">
			<template #render-cell="{ rowData }">
				{{ rowData.infrastructures.join(", ") }}
			</template>
		</XNDataTableColumn>
		<XNDataTableColumn
			v-if="localCheckDistances !== null"
			key="checkDistance"
			:title="`Distance ${localCheckDistances}`"
			sorter="default" />
		<XNDataTableColumn key="distanceAI1" title="AI1" sorter="default" />
		<XNDataTableColumn key="distanceCI1" title="CI1" sorter="default" />
		<XNDataTableColumn key="distanceIC1" title="IC1" sorter="default" />
		<XNDataTableColumn key="distanceNC1" title="NC1" sorter="default" />
	</XNDataTable>
</template>
