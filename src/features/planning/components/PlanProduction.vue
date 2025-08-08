<script setup lang="ts">
	import { computed, ComputedRef, PropType, ref, Ref } from "vue";

	// Composables
	import { useBuildingData } from "@/features/game_data/useBuildingData";

	// Components
	import PlanProductionBuilding from "@/features/planning/components/PlanProductionBuilding.vue";

	// Types & Interfaces
	import { IProductionResult } from "@/features/planning/usePlanCalculation.types";
	import { PLAN_COGCPROGRAM_TYPE } from "@/stores/planningStore.types";

	// UI
	import { NSelect, NCheckbox } from "naive-ui";

	const props = defineProps({
		disabled: {
			type: Boolean,
			required: true,
		},
		productionData: {
			type: Object as PropType<IProductionResult>,
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
		(
			e: "update:building:recipe",
			buildingIndex: number,
			recipeIndex: number,
			recipeid: string
		): void;
	}>();

	// Local State
	const localProductionData: ComputedRef<IProductionResult> = computed(
		() => props.productionData
	);
	const localSelectedBuilding: Ref<string | undefined> = ref(undefined);
	const localCOGC: ComputedRef<PLAN_COGCPROGRAM_TYPE> = computed(
		() => props.cogc
	);
	const localMatchCOGC: Ref<boolean> = ref(false);

	const { getProductionBuildingOptions } = useBuildingData();
</script>

<template>
	<div class="flex flex-row gap-x-3 pb-3 justify-between child:my-auto">
		<h2 class="text-white/80 font-bold text-lg">Production</h2>

		<div class="flex child:my-auto gap-x-3">
			<div class="text-sm">Match COGC</div>
			<n-checkbox
				v-model:checked="localMatchCOGC"
				:disabled="disabled"
				size="small" />

			<n-select
				v-model:value="localSelectedBuilding"
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
				@update:value="
					(value: string) => {
						emit('create:building', value);
					}
				" />
		</div>
	</div>

	<PlanProductionBuilding
		v-for="(building, index) in localProductionData.buildings"
		:key="building.name"
		:disabled="props.disabled"
		:building-data="building"
		:building-index="index"
		@update:building:amount="
			(index: number, value: number) =>
				emit('update:building:amount', index, value)
		"
		@delete:building="(index: number) => emit('delete:building', index)"
		@update:building:recipe:amount="
			(buildingIndex: number, recipeIndex: number, value: number) =>
				emit(
					'update:building:recipe:amount',
					buildingIndex,
					recipeIndex,
					value
				)
		"
		@delete:building:recipe="
			(buildingIndex: number, recipeIndex: number) =>
				emit('delete:building:recipe', buildingIndex, recipeIndex)
		"
		@add:building:recipe="
			(buildingIndex: number) =>
				emit('add:building:recipe', buildingIndex)
		"
		@update:building:recipe="
			(buildingIndex: number, recipeIndex: number, recipeId: string) =>
				emit(
					'update:building:recipe',
					buildingIndex,
					recipeIndex,
					recipeId
				)
		" />
</template>
