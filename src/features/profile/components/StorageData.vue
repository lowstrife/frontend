<script setup lang="ts">
	import { computed, ComputedRef } from "vue";

	// Stores
	import { useGameDataStore } from "@/stores/gameDataStore";
	import { usePlanningStore } from "@/stores/planningStore";
	import { useUserStore } from "@/stores/userStore";

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
	const userStore = useUserStore();

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

	const fioStorageDataTable: ComputedRef<IStorageDataTableElement[]> =
		computed(() => {
			const elements: IStorageDataTableElement[] = [];

			elements.push({
				name: "Planet Storage",
				refreshed:
					Object.keys(gameDataStore.fio_storage_planets).length === 0
						? undefined
						: new Date(
								Math.min(
									...Object.values(
										gameDataStore.fio_storage_planets
									).map((p) =>
										p.Timestamp
											? new Date(p.Timestamp).getTime()
											: 0
									)
								)
							),
				elements: Object.keys(gameDataStore.fio_storage_planets).length,
				reset: () => {},
			});

			elements.push({
				name: "Ship Storage",
				refreshed:
					Object.keys(gameDataStore.fio_storage_ships).length === 0
						? undefined
						: new Date(
								Math.min(
									...Object.values(
										gameDataStore.fio_storage_ships
									).map((p) =>
										new Date(p.Timestamp).getTime()
									)
								)
							),
				elements: Object.keys(gameDataStore.fio_storage_ships).length,
				reset: () => {},
			});

			elements.push({
				name: "Warehouse Storage",
				refreshed:
					Object.keys(gameDataStore.fio_storage_warehouses).length ===
					0
						? undefined
						: new Date(
								Math.min(
									...Object.values(
										gameDataStore.fio_storage_warehouses
									).map((p) =>
										new Date(p.Timestamp).getTime()
									)
								)
							),
				elements: Object.keys(gameDataStore.fio_storage_warehouses)
					.length,
				reset: () => {},
			});

			elements.push({
				name: "Planet Sites",
				refreshed:
					Object.keys(gameDataStore.fio_sites_planets).length === 0
						? undefined
						: new Date(
								Math.min(
									...Object.values(
										gameDataStore.fio_sites_planets
									).map((p) =>
										new Date(p.Timestamp).getTime()
									)
								)
							),
				elements: Object.keys(gameDataStore.fio_sites_planets).length,
				reset: () => {},
			});

			elements.push({
				name: "Ships",
				refreshed: undefined,
				elements: Object.keys(gameDataStore.fio_sites_ships).length,
				reset: () => {},
			});

			return elements;
		});
</script>

<template>
	<h2 class="text-white/80 font-bold text-lg my-auto">Browser Storage</h2>
	<div class="py-3 text-white/60">
		PRUNplanner minimizes API calls by storing data locally in your browser.
		Data refreshes automatically at set intervals or if changed and you can
		manually reset data if needed.
	</div>
	<n-table striped>
		<tbody>
			<tr>
				<th colspan="3" class="!border-b-2">Game Data</th>
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
				<th colspan="3" class="!border-b-2">Planning Data</th>
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
			<template v-if="userStore.hasFIO">
				<tr>
					<th colspan="3" class="!border-b-2">FIO Data</th>
				</tr>
				<tr v-for="element in fioStorageDataTable" :key="element.name">
					<td>{{ element.name }}</td>
					<td>
						<div class="flex justify-between">
							<span>
								{{ formatAmount(element.elements) }}
							</span>
							<span class="text-white/60">
								{{ relativeFromDate(element.refreshed, true) }}
							</span>
						</div>
					</td>
					<td></td>
				</tr>
			</template>
		</tbody>
	</n-table>

	<div class="py-3 text-white/60" v-if="userStore.hasFIO">
		Data from FIO is fetched if you did add your Prosperous Universe
		username and a FIO API Key. The refresh happens periodically in the
		background, new data becomes available automatically.
	</div>
</template>
