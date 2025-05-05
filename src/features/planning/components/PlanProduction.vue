<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Types & Interfaces
	import { PlanResult } from "@/features/planning/usePlanCalculation.types";
	import { PLAN_COGCPROGRAM_TYPE } from "@/features/planning/usePlan.types";

	// Composables
	import { useBuildingData } from "@/features/game_data/useBuildingData";

	// Components
	import PlanProductionBuilding from "@/features/planning/components/PlanProductionBuilding.vue";

	// UI
	import { NSelect, NCheckbox } from "naive-ui";

	const props = defineProps({
		disabled: {
			type: Boolean,
			required: true,
		},
		productionData: {
			type: Object as PropType<PlanResult.ProductionResult>,
			required: true,
		},
		cogc: {
			type: String as PropType<PLAN_COGCPROGRAM_TYPE>,
			required: true,
		},
	});

	const emit = defineEmits<{
		// from PlanProductionBuilding.vue
		(e: "update:building:amount", index: number, value: number): void;
		(e: "delete:building", index: number): void;
		(e: "create:building", ticker: string): void;
		(
			e: "update:building:recipe:amount",
			buildingIndex: number,
			recipeIndex: number,
			value: number
		): void;
		(
			e: "delete:building:recipe",
			buildingIndex: number,
			recipeIndex: number
		): void;
		(e: "add:building:recipe", buildingIndex: number): void;
	}>();

	// Local State
	const localProductionData: Ref<PlanResult.ProductionResult> = ref(
		props.productionData
	);
	const localSelectedBuilding: Ref<string | undefined> = ref(undefined);
	const localCOGC: Ref<PLAN_COGCPROGRAM_TYPE> = ref("---");
	const localMatchCOGC: Ref<boolean> = ref(false);

	// Prop Watcher
	watch(
		() => props.productionData,
		(newData: PlanResult.ProductionResult) => {
			localProductionData.value = newData;
		},
		{ deep: true }
	);
	watch(
		() => props.cogc,
		(newValue: PLAN_COGCPROGRAM_TYPE) => {
			localCOGC.value = newValue;
		}
	);

	const { getProductionBuildingOptions } = useBuildingData();
</script>

<template>
	<div class="flex flex-row gap-x-3 pb-3 justify-between child:my-auto">
		<h2 class="text-white/80 font-bold text-lg">Production</h2>

		<div class="flex child:my-auto gap-x-3">
			<div class="text-sm">Match COGC</div>
			<n-checkbox
				:disabled="disabled"
				v-model:checked="localMatchCOGC"
				size="small"
			/>

			<n-select
				:disabled="disabled"
				filterable
				size="small"
				class="w-full lg:!w-[300px]"
				:options="
					getProductionBuildingOptions(
						localProductionData.buildings.map((e) => e.name),
						localMatchCOGC ? localCOGC : undefined
					)
				"
				v-model:value="localSelectedBuilding"
				v-on:update:value="
					(value: string) => {
						emit('create:building', value);
					}
				"
			/>
		</div>
	</div>

	<PlanProductionBuilding
		v-for="(building, index) in localProductionData.buildings"
		:key="building.name"
		:disabled="props.disabled"
		:building-data="building"
		:building-index="index"
		v-on:update:building:amount="
			(index: number, value: number) =>
				emit('update:building:amount', index, value)
		"
		v-on:delete:building="(index: number) => emit('delete:building', index)"
		v-on:update:building:recipe:amount="
			(buildingIndex: number, recipeIndex: number, value: number) =>
				emit('update:building:recipe:amount', buildingIndex, recipeIndex, value)
		"
		v-on:delete:building:recipe="
			(buildingIndex: number, recipeIndex: number) =>
				emit('delete:building:recipe', buildingIndex, recipeIndex)
		"
		v-on:add:building:recipe="
			(buildingIndex: number) => emit('add:building:recipe', buildingIndex)
		"
	/>
</template>
