<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Types & Interfaces
	import { PlanResult } from "@/features/planning/usePlanCalculation.types";

	// Components
	import PlanProductionRecipe from "@/features/planning/components/PlanProductionRecipe.vue";

	// Util
	import { formatNumber } from "@/util/numbers";

	// UI
	import { NInputNumber, NButton } from "naive-ui";
	import { ClearSharp, PlusSharp } from "@vicons/material";

	const props = defineProps({
		disabled: {
			type: Boolean,
			required: true,
		},
		buildingData: {
			type: Object as PropType<PlanResult.ProductionBuilding>,
			required: true,
		},
		buildingIndex: {
			type: Number,
			required: true,
		},
	});

	const emit = defineEmits<{
		(e: "update:building:amount", index: number, value: number): void;
		(e: "delete:building", index: number): void;
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
	const localBuildingData: Ref<PlanResult.ProductionBuilding> = ref(
		props.buildingData
	);

	// Prop Watcher
	watch(
		() => props.buildingData,
		(newData: PlanResult.ProductionBuilding) => {
			localBuildingData.value = newData;
		},
		{ deep: true }
	);
</script>

<template>
	<div class="p-3 mb-6 rounded border-pp-border border">
		<div class="grid grid-cols-1 lg:grid-cols-[200px_auto] gap-6">
			<div>
				<h3 class="text-2xl font-bold text-white mb-3">
					{{ localBuildingData.name }}
				</h3>
				<n-input-number
					:disabled="disabled"
					v-model:value="localBuildingData.amount"
					:min="0"
					size="small"
					:on-update:value="
						(value: number | null) => {
							if (value !== null) {
								emit('update:building:amount', buildingIndex, value);
							}
						}
					"
				/>
				<div class="flex flex-row gap-x-3 justify-between py-3">
					<div>
						<n-button
							v-if="localBuildingData.recipeOptions.length > 0"
							:disabled="disabled"
							size="tiny"
							@click="emit('add:building:recipe', buildingIndex)"
						>
							<template #icon><PlusSharp /></template>
							RECIPE
						</n-button>
					</div>
					<n-button
						:disabled="disabled"
						size="tiny"
						type="error"
						@click="emit('delete:building', buildingIndex)"
					>
						<template #icon><ClearSharp /></template>
					</n-button>
				</div>
				<div class="child:p-1">
					<div
						class="flex flex-row justify-between align-center border-b border-dark-gray child:font-bold"
					>
						<div>Cost</div>
						<div>{{ formatNumber(123.45) }} $</div>
					</div>
					<div class="text-center font-bold border-b border-dark-gray">
						Efficiency
					</div>
					<div
						class="flex flex-row justify-between align-center border-b border-dark-gray"
						v-for="element in localBuildingData.efficiencyElements"
						:key="`${localBuildingData.name}#EFFICIENCY#${element.efficiencyType}`"
					>
						<div>{{ element.efficiencyType }}</div>
						<div>{{ formatNumber(element.value * 100) }} %</div>
					</div>
					<div
						class="flex flex-row justify-between align-center border-b-2 border-t-1 border-dark-gray child:font-bold"
					>
						<div>Total</div>
						<div>
							{{ formatNumber(localBuildingData.totalEfficiency * 100) }} %
						</div>
					</div>
				</div>
			</div>
			<div>
				<div
					class="grid grid-cols-1 lg:grid-cols-3 gap-6"
					v-if="localBuildingData.activeRecipes.length > 0"
				>
					<PlanProductionRecipe
						:disabled="disabled"
						:recipe-index="index"
						:recipe-data="recipe"
						:recipe-options="localBuildingData.recipeOptions"
						v-for="(recipe, index) in localBuildingData.activeRecipes"
						:key="`${index}#${recipe.recipeId}`"
						v-on:update:recipe:amount="
							(index: number, value: number) => {
								emit(
									'update:building:recipe:amount',
									buildingIndex,
									index,
									value
								);
							}
						"
						v-on:delete:building:recipe="
							(index: number) => {
								emit('delete:building:recipe', buildingIndex, index);
							}
						"
					/>
				</div>
				<div v-else class="h-full w-full flex items-center justify-center">
					No Active Recipes
				</div>
			</div>
		</div>
	</div>
</template>
