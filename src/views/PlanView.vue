<script setup lang="ts">
	import { PropType, ref, type Ref } from "vue";

	// Types & Interfaces
	import { IPlan, IPlanEmpireElement } from "@/stores/planningStore.types";
	import { IPlanet } from "@/features/game_data/gameData.types";

	// Composables
	import { usePlanetData } from "@/features/game_data/usePlanetData";
	const { getPlanet } = usePlanetData();
	import { useCXData } from "@/features/cx/useCXData";
	const { findEmpireCXUuid } = useCXData();

	// Util
	import { formatNumber } from "@/util/numbers";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";
	import PlanBonuses from "@/features/planning/components/PlanBonuses.vue";
	import PlanArea from "@/features/planning/components/PlanArea.vue";
	import PlanWorkforce from "@/features/planning/components/PlanWorkforce.vue";
	import PlanInfrastructure from "@/features/planning/components/PlanInfrastructure.vue";
	import PlanExperts from "@/features/planning/components/PlanExperts.vue";
	import PlanProduction from "@/features/planning/components/PlanProduction.vue";
	import PlanMaterialIO from "@/features/planning/components/PlanMaterialIO.vue";
	import PlanConfiguration from "@/features/planning/components/PlanConfiguration.vue";

	// UI
	import { NButton, NIcon, NTooltip } from "naive-ui";

	import {
		AutoAwesomeMosaicOutlined,
		AutoAwesomeMosaicFilled,
		ShoppingBasketSharp,
		AttachMoneySharp,
	} from "@vicons/material";

	const props = defineProps({
		disabled: {
			type: Boolean,
			required: false,
			default: false,
		},
		planData: {
			type: Object as PropType<IPlan>,
			required: true,
		},
		empireList: {
			type: Array as PropType<IPlanEmpireElement[]>,
			required: false,
		},
	});

	const refPlanData: Ref<IPlan> = ref(props.planData);
	const refEmpireList: Ref<IPlanEmpireElement[] | undefined> = ref(
		props.empireList
	);
	const refEmpireUuid: Ref<string | undefined> = ref(undefined);
	const refCXUuid: Ref<string | undefined> = ref(undefined);

	import { usePlanCalculation } from "@/features/planning/usePlanCalculation";

	const {
		result,
		planName,
		computedActiveEmpire,
		planEmpires,
		handleUpdateCorpHQ,
		handleUpdateCOGC,
		handleUpdatePermits,
		handleUpdateWorkforceLux,
		handleUpdateInfrastructure,
		handleUpdateExpert,
		handleUpdateBuildingAmount,
		handleDeleteBuilding,
		handleCreateBuilding,
		handleUpdateBuildingRecipeAmount,
		handleDeleteBuildingRecipe,
		handleAddBuildingRecipe,
		handleChangeBuildingRecipe,
		handleChangePlanName,
	} = usePlanCalculation(refPlanData, refEmpireUuid, refEmpireList, refCXUuid);

	const planetData: IPlanet = getPlanet(props.planData.planet_id);

	const refVisualShowConfiguration: Ref<boolean> = ref(true);
	const refMaterialIOShowBasked: Ref<boolean> = ref(false);

	/**
	 * Handle initial empire uuid assignment
	 *
	 * Option A: no empire list => undefined
	 * Option B: planData has empires in list, use first uuid
	 * Option C: empire list => use first element
	 * Fallback: undefined
	 */
	if (!props.empireList) {
		refEmpireUuid.value = undefined;
	} else if (planEmpires.value.length > 0) {
		refEmpireUuid.value = planEmpires.value[0].uuid;
		// update cx uuid
		refCXUuid.value = findEmpireCXUuid(refEmpireUuid.value);
	} else if (props.empireList && props.empireList.length > 0) {
		refEmpireUuid.value = props.empireList[0].uuid;
		refCXUuid.value = findEmpireCXUuid(refEmpireUuid.value);
	}
</script>

<template>
	<div
		class="h-screen grid grid-cols-1 gap-y-6"
		:class="refVisualShowConfiguration ? 'lg:grid-cols-[300px_auto]' : ''"
	>
		<div
			class="border-r border-white/10"
			:class="!refVisualShowConfiguration ? 'hidden' : 'visible'"
		>
			<div class="p-6">
				<h2 class="text-white/80 font-bold text-lg pb-3">Configuration</h2>
				<PlanConfiguration
					:disabled="disabled"
					:plan-name="planName"
					:empire-options="refEmpireList"
					:active-empire="computedActiveEmpire"
					:plan-empires="planEmpires"
					v-on:update:active-empire="
						(empireUuid: string) => {
							refEmpireUuid = empireUuid;
							refCXUuid = findEmpireCXUuid(empireUuid);
						}
					"
					v-on:update:plan-name="handleChangePlanName"
				/>
			</div>

			<div class="p-6 pt-0">
				<h2 class="text-white/80 font-bold text-lg pb-3">Area</h2>
				<PlanArea
					:disabled="disabled"
					:area-data="result.area"
					v-on:update:permits="handleUpdatePermits"
				/>
			</div>
			<div class="p-6 pt-0">
				<h2 class="text-white/80 font-bold text-lg pb-3">Infrastructure</h2>
				<PlanInfrastructure
					:disabled="disabled"
					:infrastructure-data="result.infrastructure"
					v-on:update:infrastructure="handleUpdateInfrastructure"
				/>
			</div>
			<div class="p-6 pt-0">
				<h2 class="text-white/80 font-bold text-lg pb-3">Bonuses</h2>

				<PlanBonuses
					:disabled="disabled"
					:corphq="result.corphq"
					:cogc="result.cogc"
					v-on:update:corphq="handleUpdateCorpHQ"
					v-on:update:cogc="handleUpdateCOGC"
				/>
			</div>
			<div class="p-6 pt-0">
				<h2 class="text-white/80 font-bold text-lg pb-3">Experts</h2>
				<PlanExperts
					:disabled="disabled"
					:expert-data="result.experts"
					v-on:update:expert="handleUpdateExpert"
				/>
			</div>
		</div>
		<div class="">
			<div class="border-b border-white/10 p-6">
				<div class="flex flex-row">
					<div class="my-auto pr-6">
						<n-icon
							size="24"
							@click="refVisualShowConfiguration = !refVisualShowConfiguration"
						>
							<AutoAwesomeMosaicFilled v-if="!refVisualShowConfiguration" />
							<AutoAwesomeMosaicOutlined v-else />
						</n-icon>
					</div>
					<div>
						<h1 class="text-2xl font-bold text-white">
							{{ planetData.PlanetName }}
						</h1>
						<span
							class="text-white/60"
							v-if="planetData.PlanetName != planetData.PlanetNaturalId"
						>
							{{ planetData.PlanetNaturalId }}
						</span>
					</div>
					<div class="flex-grow my-auto">
						<div class="flex justify-end gap-x-3">
							<n-button type="success" size="small">Saved</n-button>
							<n-button size="small">Share</n-button>
							<n-button size="small">Reload</n-button>
						</div>
					</div>
				</div>
			</div>
			<div class="border-b border-white/10 px-6 py-3 flex">
				<div class="my-auto pr-3 font-bold">Resources</div>
				<div class="my-auto pr-3 flex gap-x-1">
					<n-tooltip
						trigger="hover"
						v-for="resource in planetData.Resources"
						:key="`PLANET#RESOURCE#${resource.MaterialTicker}`"
					>
						<template #trigger>
							<div class="hover:cursor-help">
								<MaterialTile
									:ticker="resource.MaterialTicker"
									:amount="parseFloat(formatNumber(resource.DailyExtraction))"
								/>
							</div>
						</template>
						{{ resource.ResourceType }}
					</n-tooltip>
				</div>
				<div class="flex-grow text-end my-auto pr-6 font-bold">Tools</div>
				<div class="flex justify-end gap-x-3">
					<n-button size="small" secondary>Empire Override</n-button>
					<n-button size="small" secondary>POPR</n-button>
					<n-button size="small" secondary>Visitation Frequency</n-button>
					<n-button size="small" secondary>Construction Cart</n-button>
					<n-button size="small" secondary>Supply Cart</n-button>
					<n-button size="small" secondary>Repair Analysis</n-button>
					<n-button size="small" secondary>Habitation Optimization</n-button>
				</div>
			</div>
			<div class="p-6 grid grid-cols-1 lg:grid-cols-[auto_450px] gap-6">
				<div>
					<div class="grid grid-cols-1 2xl:grid-cols-[60%_auto] gap-6">
						<div>
							<h2 class="text-white/80 font-bold text-lg pb-3">Workforce</h2>
							<PlanWorkforce
								:disabled="disabled"
								:workforce-data="result.workforce"
								v-on:update:lux="handleUpdateWorkforceLux"
							/>
						</div>
						<div>
							<h2 class="text-white/80 font-bold text-lg pb-3">Overview</h2>
							foo
						</div>
					</div>
					<div class="pt-6">
						<PlanProduction
							:disabled="disabled"
							:production-data="result.production"
							:cogc="result.cogc"
							v-on:update:building:amount="handleUpdateBuildingAmount"
							v-on:delete:building="handleDeleteBuilding"
							v-on:create:building="handleCreateBuilding"
							v-on:update:building:recipe:amount="
								handleUpdateBuildingRecipeAmount
							"
							v-on:delete:building:recipe="handleDeleteBuildingRecipe"
							v-on:add:building:recipe="handleAddBuildingRecipe"
							v-on:update:building:recipe="handleChangeBuildingRecipe"
						/>
					</div>
				</div>
				<div>
					<div class="sticky top-3">
						<h2
							class="text-white/80 font-bold text-lg pb-3 flex justify-between child:my-auto"
						>
							<div>Material I/O</div>
							<n-button
								size="tiny"
								secondary
								@click="refMaterialIOShowBasked = !refMaterialIOShowBasked"
							>
								<template #icon>
									<ShoppingBasketSharp v-if="!refMaterialIOShowBasked" />
									<AttachMoneySharp v-else />
								</template>
							</n-button>
						</h2>
						<PlanMaterialIO
							:material-i-o-data="result.materialio"
							:show-basked="refMaterialIOShowBasked"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
