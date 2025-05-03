<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";

// Types & Interfaces
import {
	IPlan,
	IPlanRouteParams,
	LOAD_STATUS,
} from "@/features/planning/usePlan.types";
import { PlanLoadError } from "@/features/planning/usePlan.errors";

import { usePlan } from "@/features/planning/usePlan";
const { loadDefinitionFromRouteParams, isEditDisabled } = usePlan();

// Views
import PlanView from "@/views/PlanView.vue";

// Components
import GameDataWrapper from "@/features/game_data/components/GameDataWrapper.vue";

// UI
import { NSpin } from "naive-ui";

const props = defineProps({
	planetNaturalId: {
		type: String,
		required: false,
	},
	planUuid: {
		type: String,
		required: false,
	},
	sharedPlanUuid: {
		type: String,
		required: false,
	},
});

const routeStatus: IPlanRouteParams = {
	planetNaturalId: props.planetNaturalId,
	planUuid: props.planUuid,
	sharedPlanUuid: props.sharedPlanUuid,
};

const refPlanDefiniton: Ref<IPlan | undefined> = ref(undefined);
const refLoadStatus: Ref<LOAD_STATUS> = ref("LOADING");
const refDisablePlan: Ref<boolean> = ref(true);

onMounted(async () => {
	refDisablePlan.value = isEditDisabled(routeStatus);

	try {
		refPlanDefiniton.value = await loadDefinitionFromRouteParams(routeStatus);
		refLoadStatus.value = "DONE";
	} catch (error) {
		if (error instanceof PlanLoadError) {
			switch (error.code) {
				case "UNIMPLEMENTED": {
					refLoadStatus.value = "LOAD_FAILURE";
					break;
				}
				case "MISSING_PLANET_ID": {
					refLoadStatus.value = "MISSING_PLANET_ID";
					break;
				}
				case "PLANET_FAILURE": {
					refLoadStatus.value = "LOAD_FAILURE";
					break;
				}
				case "API_FAILURE": {
					refLoadStatus.value = "LOAD_FAILURE";
					break;
				}
			}
		} else {
			console.error("Unexpected error while loading data", error);
		}
	}
});
</script>

<template>
	<GameDataWrapper
		v-if="refLoadStatus == 'DONE'"
		load-buildings
		load-exchanges
		load-materials
		load-recipes
	>
		<PlanView
			:plan-data="refPlanDefiniton"
			:disabled="refDisablePlan"
			v-if="refPlanDefiniton"
		/>
	</GameDataWrapper>
	<div
		v-else
		class="relative w-full h-full bg-[url('/images/bg_striped_prunplanner.png')] bg-center bg-repeat"
	>
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="bg-black p-8 rounded shadow-lg text-center">
				<div v-if="refLoadStatus == 'LOADING'">
					<n-spin />
					<div class="pt-3">Loading Data..</div>
				</div>
				<div v-else-if="refLoadStatus == 'LOAD_FAILURE'">
					Error loading planet or plan data.
				</div>
				<div v-else-if="refLoadStatus == 'MISSING_PLANET_ID'">
					Missing planet natural id in URL.
				</div>
				<div v-else>Unknown error.</div>
			</div>
		</div>
	</div>
</template>
