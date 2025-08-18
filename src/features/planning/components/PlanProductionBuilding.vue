<script setup lang="ts">
	import { computed, ComputedRef, PropType } from "vue";

	// Types & Interfaces
	import { IProductionBuilding } from "@/features/planning/usePlanCalculation.types";

	// Components
	import PlanProductionRecipe from "@/features/planning/components/PlanProductionRecipe.vue";

	// Util
	import { formatNumber } from "@/util/numbers";

	// UI
	import { PTooltip, PButton } from "@/ui";
	import { NInputNumber, NButton, NTooltip } from "naive-ui";
	import { ClearSharp, PlusSharp } from "@vicons/material";

	const props = defineProps({
		disabled: {
			type: Boolean,
			required: true,
		},
		buildingData: {
			type: Object as PropType<IProductionBuilding>,
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
		(
			e: "update:building:recipe",
			buildingIndex: number,
			recipeIndex: number,
			recipeid: string
		): void;
	}>();

	// Local State
	const localBuildingData: ComputedRef<IProductionBuilding> = computed(
		() => props.buildingData
	);
</script>

<template>
	<div class="mb-6">
		<div
			class="p-3 rounded-tl rounded-tr border-pp-border border-l border-t border-r flex gap-x-3 justify-between">
			<h3 class="text-2xl font-bold text-white">
				{{ localBuildingData.name }}
			</h3>
			<div class="flex gap-x-3">
				<n-input-number
					v-model:value="localBuildingData.amount"
					:disabled="disabled"
					:min="0"
					size="small"
					@update:value="
						(value: number | null) => {
							if (value !== null) {
								emit(
									'update:building:amount',
									buildingIndex,
									value
								);
							}
						}
					" />
				<PButton
					v-if="localBuildingData.recipeOptions.length > 0"
					:disabled="disabled"
					@click="emit('add:building:recipe', buildingIndex)">
					<template #icon><PlusSharp /></template>
					RECIPE
				</PButton>
				<PButton
					:disabled="disabled"
					type="error"
					@click="emit('delete:building', buildingIndex)">
					<template #icon><ClearSharp /></template>
				</PButton>
			</div>
		</div>
		<div class="p-3 border-pp-border border-l border-t border-r">
			<div
				v-if="localBuildingData.activeRecipes.length > 0"
				class="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<PlanProductionRecipe
					v-for="(recipe, index) in localBuildingData.activeRecipes"
					:key="`${index}#${recipe.recipeId}`"
					:disabled="disabled"
					:recipe-index="index"
					:recipe-data="recipe"
					:recipe-options="localBuildingData.recipeOptions"
					@update:building:recipe:amount="
						(index: number, value: number) => {
							emit(
								'update:building:recipe:amount',
								buildingIndex,
								index,
								value
							);
						}
					"
					@delete:building:recipe="
						(index: number) => {
							emit(
								'delete:building:recipe',
								buildingIndex,
								index
							);
						}
					"
					@update:building:recipe="
						(index: number, recipeid: string) => {
							emit(
								'update:building:recipe',
								buildingIndex,
								index,
								recipeid
							);
						}
					" />
			</div>
			<div v-else class="h-full w-full flex items-center justify-center">
				No Active Recipes
			</div>
		</div>
		<div
			class="p-3 border-pp-border border rounded-bl rounded-br bg-white/5 flex flex-row gap-x-3 justify-between">
			<div>
				<n-tooltip trigger="hover">
					<template #trigger>
						<div class="flex gap-x-3 hover:cursor-help">
							<span>Efficiency</span>
							<span class="font-bold">
								{{
									formatNumber(
										localBuildingData.totalEfficiency * 100
									)
								}}
								%
							</span>
						</div>
					</template>

					<div
						v-for="element in localBuildingData.efficiencyElements"
						:key="`${localBuildingData.name}#EFFICIENCY#${element.efficiencyType}`"
						class="flex flex-row justify-between align-center gap-x-3 child:p-1">
						<div>{{ element.efficiencyType }}</div>
						<div>{{ formatNumber(element.value * 100) }} %</div>
					</div>
				</n-tooltip>
			</div>
			<div class="flex gap-x-3">
				<span>Revenue</span>
				<span class="font-bold">
					{{ formatNumber(localBuildingData.dailyRevenue) }} $
				</span>
				<span>Construction Cost</span>
				<span class="font-bold">
					{{ formatNumber(localBuildingData.constructionCost * -1) }}
					$
				</span>
			</div>
		</div>
	</div>
</template>
