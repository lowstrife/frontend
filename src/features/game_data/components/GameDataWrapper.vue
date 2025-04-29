<template>
	<template v-if="!fullyLoaded">
		<div
			class="relative w-full h-full bg-[url('/images/bg_striped_prunplanner.png')] bg-center bg-repeat"
		>
			<div class="relative w-full h-full bg-black/60">
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="bg-black p-8 rounded shadow-lg">
						<h1 class="text-2xl font-bold font-mono mb-3">Loading Data..</h1>

						<div
							class="flex flex-row mb-2 align-middle"
							v-for="elem in Object.values(loadingStatus).filter(
								(e) => e.status != LOADING_STATUS_ENUM.SKIP
							)"
							:key="elem.name"
						>
							<div class="pr-5">
								<n-spin
									v-if="elem.status === LOADING_STATUS_ENUM.LOAD"
									:size="20"
								/>
								<n-icon :size="20" v-else>
									<CheckSharp v-if="elem.status === LOADING_STATUS_ENUM.DONE" />
									<ErrorSharp v-else />
								</n-icon>
							</div>
							<div>{{ elem.name }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</template>

	<slot v-else />
</template>

<script setup lang="ts">
	import { computed, ComputedRef, onMounted, PropType, ref, Ref } from "vue";

	// UI
	import { NSpin, NIcon } from "naive-ui";
	import { CheckSharp, ErrorSharp } from "@vicons/material";

	// Stores
	import { useGameDataStore } from "@/stores/gameDataStore";
	import {
		LOADING_STATUS_ENUM,
		WrapperLoader,
		WrapperLoaderElement,
		WrapperTask,
	} from "@/features/game_data/components/GameDataWrapper.types";

	// Types

	const gameDataStore = useGameDataStore();

	const props = defineProps({
		loadMaterials: {
			type: Boolean,
			required: false,
		},
		loadExchanges: {
			type: Boolean,
			required: false,
		},
		loadRecipes: {
			type: Boolean,
			required: false,
		},
		loadBuildings: {
			type: Boolean,
			required: false,
		},
		loadPlanet: {
			type: String,
			required: false,
		},
		loadMultiplePlanets: {
			type: Array as PropType<string[]>,
			required: false,
		},
	});

	const loadingStatus: Ref<WrapperLoader> = ref({
		MATERIALS: {
			name: "Material Information",
			status: gameDataStore.hasMaterials
				? LOADING_STATUS_ENUM.DONE
				: LOADING_STATUS_ENUM.LOAD,
		},
		EXCHANGES: {
			name: "Exchange Market Information",
			status: gameDataStore.hasExchanges
				? LOADING_STATUS_ENUM.DONE
				: LOADING_STATUS_ENUM.LOAD,
		},
		RECIPES: {
			name: "Recipe Information",
			status: gameDataStore.hasRecipes
				? LOADING_STATUS_ENUM.DONE
				: LOADING_STATUS_ENUM.LOAD,
		},
		BUILDINGS: {
			name: "Building Information",
			status: gameDataStore.hasBuildings
				? LOADING_STATUS_ENUM.DONE
				: LOADING_STATUS_ENUM.LOAD,
		},
		PLANET: {
			name: "Planet Data",
			status: gameDataStore.hasPlanet(props.loadPlanet ?? "")
				? LOADING_STATUS_ENUM.DONE
				: LOADING_STATUS_ENUM.LOAD,
		},
		MULTIPLE_PLANETS: {
			name: "Multiple Planets",
			status: gameDataStore.hasMultiplePlanets(props.loadMultiplePlanets ?? [])
				? LOADING_STATUS_ENUM.DONE
				: LOADING_STATUS_ENUM.LOAD,
		},
	});

	const fullyLoaded: ComputedRef<boolean> = computed(() => {
		return Object.values(loadingStatus.value).every(
			(item: WrapperLoaderElement) =>
				item.status === LOADING_STATUS_ENUM.DONE ||
				item.status === LOADING_STATUS_ENUM.SKIP
		);
	});

	onMounted(async () => {
		// find data to load
		const promises: Promise<void>[] = [];

		const fetchTasks: WrapperTask[] = [
			{
				prop: props.loadMaterials,
				statusKey: "MATERIALS",
				fct: gameDataStore.performLoadMaterials,
			},
			{
				prop: props.loadExchanges,
				statusKey: "EXCHANGES",
				fct: gameDataStore.performLoadExchanges,
			},
			{
				prop: props.loadRecipes,
				statusKey: "RECIPES",
				fct: gameDataStore.performLoadRecipes,
			},
			{
				prop: props.loadBuildings,
				statusKey: "BUILDINGS",
				fct: gameDataStore.performLoadBuildings,
			},
			{
				prop: props.loadPlanet,
				statusKey: "PLANET",
				fct: () => gameDataStore.performLoadPlanet(props.loadPlanet ?? ""),
			},
			{
				prop: props.loadMultiplePlanets,
				statusKey: "MULTIPLE_PLANETS",
				fct: () =>
					gameDataStore.performLoadMultiplePlanets(
						props.loadMultiplePlanets ?? []
					),
			},
		];

		fetchTasks.forEach((task) => {
			if (
				task.prop &&
				loadingStatus.value[task.statusKey].status != LOADING_STATUS_ENUM.DONE
			) {
				promises.push(
					task.fct().then((result: boolean) => {
						loadingStatus.value[task.statusKey].status = result
							? LOADING_STATUS_ENUM.DONE
							: LOADING_STATUS_ENUM.ERROR;
					})
				);
			} else {
				loadingStatus.value[task.statusKey].status = LOADING_STATUS_ENUM.SKIP;
			}
		});

		// execute promises
		await Promise.all(promises).then(
			// trigger stale data check and refresh
			() => gameDataStore.performStaleDataRefresh()
		);
	});
</script>
