<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Types & Interfaces
	import {
		IProductionBuildingRecipe,
		IRecipeBuildingOption,
	} from "@/features/planning/usePlanCalculation.types";

	// Util
	import { humanizeTimeMs } from "@/util/date";
	import { formatNumber } from "@/util/numbers";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// UI
	import { NInputNumber, NButton, NTable } from "naive-ui";
	import { ClearSharp, AnalyticsOutlined } from "@vicons/material";

	const props = defineProps({
		disabled: {
			type: Boolean,
			required: true,
		},
		recipeData: {
			type: Object as PropType<IProductionBuildingRecipe>,
			required: true,
		},
		recipeIndex: {
			type: Number,
			required: true,
		},
		recipeOptions: {
			type: Array as PropType<IRecipeBuildingOption[]>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(
			e: "update:building:recipe:amount",
			index: number,
			value: number
		): void;
		(e: "delete:building:recipe", index: number): void;
		(e: "update:building:recipe", index: number, recipeid: string): void;
	}>();

	// Local State
	const localRecipeData: Ref<IProductionBuildingRecipe> = ref(
		props.recipeData
	);
	const localRecipeOptions: Ref<IRecipeBuildingOption[]> = ref(
		props.recipeOptions
	);

	const localRecipeAmount: Ref<number> = ref(props.recipeData.amount);
	const localRecipeIndex: Ref<number> = ref(props.recipeIndex.valueOf());

	const refShowRecipeOptions: Ref<boolean> = ref(false);

	// Prop Watcher
	watch(
		() => props.recipeData,
		(newData: IProductionBuildingRecipe) => {
			localRecipeData.value = newData;
			localRecipeAmount.value = newData.amount;
		},
		{ deep: true }
	);
	watch(
		() => props.recipeOptions,
		(newData: IRecipeBuildingOption[]) => {
			localRecipeOptions.value = newData;
		},
		{ deep: true }
	);
	watch(
		() => props.recipeIndex,
		(newIndex: number) => {
			localRecipeIndex.value = newIndex;
		}
	);
</script>

<template>
	<div>
		<n-input-number
			v-model:value="localRecipeAmount"
			:disabled="disabled"
			size="small"
			:min="0"
			@update:value="
				(value: number | null) => {
					if (value !== null) {
						emit(
							'update:building:recipe:amount',
							recipeIndex,
							value
						);
					}
				}
			" />
		<div
			v-click-outside="
				() => {
					refShowRecipeOptions = false;
				}
			"
			class="border border-pp-border my-3 p-3 flex flex-row justify-between child:my-auto hover:cursor-pointer"
			@click="refShowRecipeOptions = true">
			<div class="flex gap-x-1">
				<MaterialTile
					v-for="material in localRecipeData.recipe.Outputs"
					:key="`${localRecipeData.recipe.BuildingTicker}#${material.Ticker}`"
					:ticker="material.Ticker"
					:amount="material.Amount" />
			</div>
			<div class="text-white/50 text-xs">
				<span class="font-bold">
					{{ humanizeTimeMs(localRecipeData.time) }}
				</span>
				<br />
				<span
					>{{
						formatNumber(localRecipeData.dailyShare * 100)
					}}
					%</span
				>
			</div>
		</div>
		<div
			class="relative z-10"
			:class="refShowRecipeOptions ? 'visible' : 'hidden'">
			<n-table
				class="absolute lg:!min-w-[500px] border border-pp-border !bg-black"
				striped>
				<thead>
					<tr>
						<th>Input</th>
						<th>Time</th>
						<th>Output</th>
						<th>$ / Day</th>
						<th>ROI</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(recipe, index) in localRecipeOptions"
						:key="`${recipe.BuildingTicker}#${recipe.RecipeId}`"
						class="child:whitespace-nowrap hover:cursor-pointer"
						@click="
							emit(
								'update:building:recipe',
								localRecipeIndex,
								recipe.RecipeId
							)
						">
						<td
							:class="
								recipe.RecipeId === localRecipeData.recipeId
									? '!border-l-3 !border-l-green-500'
									: ''
							">
							<div class="flex gap-1">
								<MaterialTile
									v-for="material in recipe.Inputs"
									:key="`${index}#INPUT#${material.Ticker}`"
									:ticker="material.Ticker"
									:amount="material.Amount" />
							</div>
						</td>
						<td>
							{{ humanizeTimeMs(recipe.TimeMs) }}
						</td>
						<td>
							<div class="flex gap-1">
								<MaterialTile
									v-for="material in recipe.Outputs"
									:key="`${index}#OUTPUT#${material.Ticker}`"
									:ticker="material.Ticker"
									:amount="material.Amount" />
							</div>
						</td>
						<td
							:class="
								recipe.dailyRevenue >= 0
									? '!text-positive'
									: '!text-negative'
							">
							{{ formatNumber(recipe.dailyRevenue) }} $
						</td>
						<td
							:class="
								recipe.roi >= 0
									? '!text-positive'
									: '!text-negative'
							">
							{{ formatNumber(recipe.roi) }} d
						</td>
					</tr>
				</tbody>
				<tbody>
					<tr>
						<td
							colspan="5"
							class="text-xs !p-2 !text-white/60 !border-t-1">
							<strong>Revenue / Day</strong> is calculated by
							taking the daily income generated from a recipe and
							subtracting both the daily workforce cost (all
							luxuries provided) and the daily building
							degradation cost (1/180th of the construction cost).
							The income from the recipe is based on the
							difference between the input material costs and the
							output material values.
							<strong>ROI (Payback)</strong> is the time required
							for a continuously operating recipe to generate
							enough revenue to offset the building's construction
							cost. This considers daily degradation and workforce
							costs as well.
						</td>
					</tr>
				</tbody>
			</n-table>
		</div>

		<div class="mb-3 flex flex-row justify-between child:my-auto">
			<n-button size="tiny">
				<template #icon><AnalyticsOutlined /> </template>
			</n-button>
			<n-button
				size="tiny"
				type="error"
				@click="
					() => {
						emit('delete:building:recipe', localRecipeIndex);
					}
				">
				<template #icon><ClearSharp /></template>
			</n-button>
		</div>
	</div>
</template>
