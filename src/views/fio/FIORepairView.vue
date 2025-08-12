<script setup lang="ts">
	import { ref } from "vue";

	// Stores
	import { useGameDataStore } from "@/stores/gameDataStore";

	// Composables
	import { useFIORepair } from "@/features/fio/useFIORepair";

	// Components
	import FIORepairPlanet from "@/features/fio/components/FIORepairPlanet.vue";
	import FIORepairShip from "@/features/fio/components/FIORepairShip.vue";

	const gameDataStore = useGameDataStore();

	const { planetRepairTable, shipRepairTable } = useFIORepair(
		ref(gameDataStore.fio_sites_planets),
		ref(gameDataStore.fio_sites_ships)
	);
</script>

<template>
	<div class="min-h-screen flex flex-col">
		<div
			class="px-6 py-3 border-b border-white/10 flex flex-row justify-between">
			<h1 class="text-2xl font-bold my-auto">FIO Repair</h1>
		</div>

		<div
			class="flex-grow grid grid-cols-1 lg:grid-cols-[60%_auto] gap-3 divide-x divide-white/10 child:px-6 child:py-3">
			<div>
				<FIORepairPlanet :repair-data="planetRepairTable" />
			</div>
			<div>
				<FIORepairShip :repair-data="shipRepairTable" />
			</div>
		</div>
	</div>
</template>
