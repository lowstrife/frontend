<script setup lang="ts">
	import { computed, ComputedRef } from "vue";

	// Stores
	import { useGameDataStore } from "@/stores/gameDataStore";
	import { usePlanningStore } from "@/stores/planningStore";

	// Util
	import { relativeFromDate } from "@/util/date";
	import { formatAmount } from "@/util/numbers";

	// Types & Interfaces
	import { IStorageDataTableElement } from "@/features/profile/storageData.types";

	// UI
	import { NTable, NButton } from "naive-ui";
	import { ClearSharp } from "@vicons/material";

	const gameDataStore = useGameDataStore();
	const planningStore = usePlanningStore();

	const lastRefreshedPlanets: ComputedRef<Date | undefined> = computed(() => {
		return Object.keys(gameDataStore.lastRefreshedPlanets).length === 0
			? undefined
			: new Date(
					Math.max(
						...Object.values(gameDataStore.lastRefreshedPlanets)
							.filter((f) => f !== undefined)
							.map((e) => e.getTime())
					)
				);
	});

	const gameDataTable: ComputedRef<IStorageDataTableElement[]> = computed(
		() => {
			const elements: IStorageDataTableElement[] = [];

			elements.push({
				name: "Materials",
				refreshed: gameDataStore.lastRefreshedMaterials,
				elements: Object.keys(gameDataStore.materials).length,
				reset: gameDataStore.resetMaterials,
			});
			elements.push({
				name: "Buildings",
				refreshed: gameDataStore.lastRefreshedBuildings,
				elements: Object.keys(gameDataStore.buildings).length,
				reset: gameDataStore.resetBuildings,
			});
			elements.push({
				name: "Recipes",
				refreshed: gameDataStore.lastRefreshedRecipes,
				elements: Object.values(gameDataStore.recipes).reduce(
					(sum, element) => sum + element.length,
					0
				),
				reset: gameDataStore.resetRecipes,
			});
			elements.push({
				name: "Planets",
				refreshed: lastRefreshedPlanets.value,
				elements: Object.keys(gameDataStore.planets).length,
				reset: gameDataStore.resetPlanets,
			});
			elements.push({
				name: "Exchange",
				refreshed: gameDataStore.lastRefreshedExchanges,
				elements: Object.keys(gameDataStore.exchanges).length,
				reset: gameDataStore.resetExchanges,
			});

			return elements;
		}
	);

	const planningDataTable: ComputedRef<IStorageDataTableElement[]> = computed(
		() => {
			const elements: IStorageDataTableElement[] = [];

			elements.push({
				name: "Plans",
				refreshed: undefined,
				elements: Object.keys(planningStore.plans).length,
				reset: planningStore.resetPlans,
			});
			elements.push({
				name: "Empires",
				refreshed: undefined,
				elements: Object.keys(planningStore.empires).length,
				reset: planningStore.resetEmpires,
			});
			elements.push({
				name: "CX Preferences",
				refreshed: undefined,
				elements: Object.keys(planningStore.cxs).length,
				reset: planningStore.resetCXS,
			});
			elements.push({
				name: "Shares",
				refreshed: undefined,
				elements: Object.keys(planningStore.shared).length,
				reset: planningStore.resetShared,
			});

			return elements;
		}
	);
</script>

<template>
	<h2 class="text-white/80 font-bold text-lg my-auto">Browser Storage</h2>
	<div class="py-3 text-white/60">
		PRUNplanner minimizes API calls by storing data locally in your browser.
		Data refreshes automatically at set intervals or if changed, but you can
		manually reset data if needed.
	</div>
	<n-table striped>
		<tbody>
			<tr>
				<th colspan="4">Game Data</th>
			</tr>
			<tr v-for="element in gameDataTable" :key="element.name">
				<td>{{ element.name }}</td>
				<td>
					<div class="flex justify-between">
						<span>
							{{ formatAmount(element.elements) }}
						</span>
						<span v-if="element.refreshed" class="text-white/60">
							{{ relativeFromDate(element.refreshed) }}
						</span>
					</div>
				</td>
				<td class="text-right">
					<n-button type="error" size="tiny" @click="element.reset">
						<template #icon>
							<ClearSharp />
						</template>
					</n-button>
				</td>
			</tr>
			<tr>
				<th colspan="4">Planning Data</th>
			</tr>
			<tr v-for="element in planningDataTable" :key="element.name">
				<td>{{ element.name }}</td>
				<td>
					<div class="flex justify-between">
						<span>
							{{ formatAmount(element.elements) }}
						</span>
					</div>
				</td>
				<td class="text-right">
					<n-button type="error" size="tiny" @click="element.reset">
						<template #icon>
							<ClearSharp />
						</template>
					</n-button>
				</td>
			</tr>
		</tbody>
	</n-table>
</template>
