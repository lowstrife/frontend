<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Types & Interfaces
	import { PlanResult } from "@/features/planning/usePlanCalculation.types";

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
			type: Object as PropType<PlanResult.ProductionBuildingRecipe>,
			required: true,
		},
		recipeIndex: {
			type: Number,
			required: true,
		},
		recipeOptions: {
			type: Array as PropType<PlanResult.IRecipeBuildingOption[]>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(e: "update:recipe:amount", index: number, value: number): void;
		(e: "delete:building:recipe", index: number): void;
	}>();

	// Local State
	const localRecipeData: Ref<PlanResult.ProductionBuildingRecipe> = ref(
		props.recipeData
	);
	const localRecipeOptions: Ref<PlanResult.IRecipeBuildingOption[]> = ref(
		props.recipeOptions
	);

	const localRecipeAmount: Ref<number> = ref(props.recipeData.amount);

	const refShowRecipeOptions: Ref<boolean> = ref(false);

	// Prop Watcher
	watch(
		() => props.recipeData,
		(newData: PlanResult.ProductionBuildingRecipe) => {
			localRecipeData.value = newData;
			localRecipeAmount.value = newData.amount;
		},
		{ deep: true }
	);
	watch(
		() => props.recipeOptions,
		(newData: PlanResult.IRecipeBuildingOption[]) => {
			localRecipeOptions.value = newData;
		},
		{ deep: true }
	);
</script>

<template>
	<div>
		<n-input-number
			:disabled="disabled"
			v-model:value="localRecipeAmount"
			size="small"
			:min="0"
			v-on:update:value="
				(value: number | null) => {
					if (value !== null) {
						emit('update:recipe:amount', recipeIndex, value);
					}
				}
			"
		/>
		<div
			class="border border-pp-border my-3 p-3 flex flex-row justify-between child:my-auto hover:cursor-pointer"
			@click="refShowRecipeOptions = true"
			v-click-outside="
				() => {
					refShowRecipeOptions = false;
				}
			"
		>
			<div class="flex gap-x-1">
				<MaterialTile
					:ticker="material.Ticker"
					:amount="material.Amount"
					v-for="material in localRecipeData.recipe.Outputs"
					:key="`${localRecipeData.recipe.BuildingTicker}#${material.Ticker}`"
				/>
			</div>
			<div class="text-white/50 text-xs">
				<span class="font-bold">
					{{ humanizeTimeMs(localRecipeData.time) }}
				</span>
				<br />
				<span>{{ formatNumber(localRecipeData.dailyShare * 100) }} %</span>
			</div>
		</div>
		<div
			class="relative z-10"
			:class="refShowRecipeOptions ? 'visible' : 'hidden'"
		>
			<n-table class="absolute border border-pp-border !bg-black" striped>
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
					>
						<td
							:class="
								recipe.RecipeId === localRecipeData.recipeId
									? '!border-l-3 !border-l-green-500'
									: ''
							"
						>
							<div class="flex gap-1">
								<MaterialTile
									:ticker="material.Ticker"
									:amount="material.Amount"
									v-for="material in recipe.Inputs"
									:key="`${index}#INPUT#${material.Ticker}`"
								/>
							</div>
						</td>
						<td>
							{{ humanizeTimeMs(recipe.TimeMs) }}
						</td>
						<td>
							<div class="flex gap-1">
								<MaterialTile
									:ticker="material.Ticker"
									:amount="material.Amount"
									v-for="material in recipe.Outputs"
									:key="`${index}#OUTPUT#${material.Ticker}`"
								/>
							</div>
						</td>
						<td>{{ formatNumber(recipe.dailyRevenue) }} $</td>
						<td>{{ formatNumber(recipe.roi) }} d</td>
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
						emit('delete:building:recipe', recipeIndex);
					}
				"
			>
				<template #icon><ClearSharp /></template>
			</n-button>
		</div>
	</div>
</template>
