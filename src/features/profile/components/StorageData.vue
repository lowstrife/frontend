<script setup lang="ts">
	import { computed, ComputedRef } from "vue";

	// Stores
	import { useGameDataStore } from "@/stores/gameDataStore";
	import { usePlanningStore } from "@/stores/planningStore";
	import { useUserStore } from "@/stores/userStore";

	// Util
	import { formatAmount } from "@/util/numbers";

	// Types & Interfaces
	import { IStorageDataTableElement } from "@/features/profile/storageData.types";

	// UI
	import { NTable } from "naive-ui";

	const gameDataStore = useGameDataStore();
	const planningStore = usePlanningStore();
	const userStore = useUserStore();

	const gameDataTable: ComputedRef<IStorageDataTableElement[]> = computed(
		() => {
			const elements: IStorageDataTableElement[] = [];

			elements.push({
				name: "Materials",
				elements: Object.keys(gameDataStore.materials).length,
			});
			elements.push({
				name: "Buildings",
				elements: Object.keys(gameDataStore.buildings).length,
			});
			elements.push({
				name: "Recipes",
				elements: Object.values(gameDataStore.recipes).reduce(
					(sum, element) => sum + element.length,
					0
				),
			});
			elements.push({
				name: "Planets",
				elements: Object.keys(gameDataStore.planets).length,
			});
			elements.push({
				name: "Exchange",
				elements: Object.keys(gameDataStore.exchanges).length,
			});

			return elements;
		}
	);

	const planningDataTable: ComputedRef<IStorageDataTableElement[]> = computed(
		() => {
			const elements: IStorageDataTableElement[] = [];

			elements.push({
				name: "Plans",

				elements: Object.keys(planningStore.plans).length,
			});
			elements.push({
				name: "Empires",

				elements: Object.keys(planningStore.empires).length,
			});
			elements.push({
				name: "CX Preferences",

				elements: Object.keys(planningStore.cxs).length,
			});
			elements.push({
				name: "Shares",

				elements: Object.keys(planningStore.shared).length,
			});

			return elements;
		}
	);

	const fioStorageDataTable: ComputedRef<IStorageDataTableElement[]> =
		computed(() => {
			const elements: IStorageDataTableElement[] = [];

			elements.push({
				name: "Planet Storage",

				elements: Object.keys(gameDataStore.fio_storage_planets).length,
			});

			elements.push({
				name: "Ship Storage",

				elements: Object.keys(gameDataStore.fio_storage_ships).length,
			});

			elements.push({
				name: "Warehouse Storage",

				elements: Object.keys(gameDataStore.fio_storage_warehouses)
					.length,
			});

			elements.push({
				name: "Planet Sites",

				elements: Object.keys(gameDataStore.fio_sites_planets).length,
			});

			elements.push({
				name: "Ships",
				elements: Object.keys(gameDataStore.fio_sites_ships).length,
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
				<th colspan="2" class="!border-b-2">Game Data</th>
			</tr>
			<tr v-for="element in gameDataTable" :key="element.name">
				<td>{{ element.name }}</td>
				<td>
					<div class="flex justify-between">
						<span>
							{{ formatAmount(element.elements) }}
						</span>
					</div>
				</td>
			</tr>
			<tr>
				<th colspan="2" class="!border-b-2">Planning Data</th>
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
			</tr>
			<template v-if="userStore.hasFIO">
				<tr>
					<th colspan="2" class="!border-b-2">FIO Data</th>
				</tr>
				<tr v-for="element in fioStorageDataTable" :key="element.name">
					<td>{{ element.name }}</td>
					<td>
						<div class="flex justify-between">
							<span>
								{{ formatAmount(element.elements) }}
							</span>
						</div>
					</td>
				</tr>
			</template>
		</tbody>
	</n-table>

	<div v-if="userStore.hasFIO" class="py-3 text-white/60">
		Data from FIO is fetched if you did add your Prosperous Universe
		username and a FIO API Key. The refresh happens periodically in the
		background, new data becomes available automatically.
	</div>
</template>
