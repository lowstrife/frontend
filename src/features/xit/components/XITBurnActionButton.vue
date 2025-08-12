<script setup lang="ts">
	import { computed, ComputedRef, nextTick, PropType, ref, Ref } from "vue";

	// Composables
	import { useBurnXITAction } from "@/features/xit/useBurnXITAction";
	import { useXITAction } from "@/features/xit/useXITAction";
	import { usePreferences } from "@/features/preferences/usePreferences";

	const { burnResupplyDays, burnOrigin, getBurnDisplayClass } =
		usePreferences();
	const { transferJSON } = useXITAction();

	// Util
	import { copyToClipboard } from "@/util/data";
	import { formatAmount, formatNumber } from "@/util/numbers";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// UI
	import {
		NButton,
		NDrawer,
		NDrawerContent,
		NTable,
		NForm,
		NFormItem,
		NInputNumber,
		NCheckbox,
		NInput,
		NSelect,
	} from "naive-ui";

	// Constants
	import { XITSTATIONWAREHOUSES } from "@/features/xit/xitConstants";

	// Types & Interfaces
	import { IXITActionElement } from "@/features/xit/xitAction.types";

	const props = defineProps({
		elements: {
			type: Array as PropType<IXITActionElement[]>,
			required: true,
		},
		// Button Definitions
		buttonText: {
			type: String,
			required: false,
			default: "XIT",
		},
		buttonSize: {
			type: String as PropType<"tiny" | "small" | "medium" | "large">,
			required: false,
			default: "small",
		},
		buttonSecondary: {
			type: Boolean,
			required: false,
			default: false,
		},
		// Drawer Definitions
		drawerTitle: {
			type: String,
			required: false,
			default: "XIT Action",
		},
		drawerWidth: {
			type: Number,
			required: false,
			default: 650,
		},
	});

	// Drawer Display
	const loadDrawer: Ref<boolean> = ref(false);
	const showDrawer: Ref<boolean> = ref(false);
	const xitBuyFromCX = ref(true);

	function show(): void {
		if (!showDrawer.value) {
			loadDrawer.value = true;
			nextTick().then(() => (showDrawer.value = true));
		}
	}

	// Local State & Watcher
	const localElements: ComputedRef<IXITActionElement[]> = computed(
		() => props.elements
	);

	const refHideInfinite: Ref<boolean> = ref(false);
	const refMaterialOverrides: Ref<Record<string, number>> = ref({});
	const refMaterialInactives: Ref<Set<string>> = ref(new Set([]));

	const { materialTable, totalWeightVolume } = useBurnXITAction(
		localElements,
		burnResupplyDays,
		refHideInfinite,
		refMaterialOverrides,
		refMaterialInactives
	);
</script>

<template>
	<n-button :size="buttonSize" :secondary="buttonSecondary" @click="show">
		{{ buttonText }}
	</n-button>

	<n-drawer v-if="loadDrawer" v-model:show="showDrawer" :width="drawerWidth">
		<n-drawer-content closable body-class="bg-black">
			<template #header> {{ drawerTitle }} </template>

			<div class="mb-3 grid grid-cols-1 xl:grid-cols-2 gap-3">
				<div>
					<n-form
						label-placement="left"
						label-width="auto"
						label-align="left"
						size="small">
						<n-form-item label="Origin">
							<n-select
								v-model:value="burnOrigin"
								:options="XITSTATIONWAREHOUSES" />
						</n-form-item>
						<n-form-item label="Target Days">
							<n-input-number
								v-model:value="burnResupplyDays"
								:min="0"
								show-button />
						</n-form-item>
						<n-form-item label="Buy Items From CX">
							<n-checkbox
								v-model:checked="xitBuyFromCX"
								:disabled="burnOrigin === 'Configure on Execution'" />
							<p v-if="burnOrigin === 'Configure on Execution'" class="p-3">
								Requires origin warehouse to purchase
							</p>
						</n-form-item>
						<n-form-item label="Hide Infinite">
							<n-checkbox v-model:checked="refHideInfinite" />
						</n-form-item>
					</n-form>
				</div>
				<div class="flex flex-row gap-x-3 pb-3">
					<div class="text-nowrap">JSON</div>
					<n-input
						v-model:value="
							transferJSON(
								materialTable
									.filter(
										(mt) =>
											mt.total !== Infinity &&
											mt.total > 0 &&
											mt.active
									)
									.map((m) => {
										return {
											ticker: m.ticker,
											value: m.total,
										};
									}),
								{
									name: 'Burn Supply',
									origin: burnOrigin,
									buy: xitBuyFromCX,
								},
							).value
						"
						size="small"
						type="textarea" />
					<n-button
						size="small"
						@click="
							copyToClipboard(
								transferJSON(
									materialTable
										.filter(
											(mt) =>
												mt.total !== Infinity &&
												mt.total > 0 &&
												mt.active
										)
										.map((m) => {
											return {
												ticker: m.ticker,
												value: m.total,
											};
										}),
									{
										name: 'Burn Supply',
										origin: burnOrigin,
										buy: xitBuyFromCX,
									},
								).value
							)
						">
						Copy
					</n-button>
				</div>
			</div>

			<n-table striped>
				<thead>
					<tr>
						<th></th>
						<th>Ticker</th>
						<th>Stock</th>
						<th>Delta</th>
						<th>Burn</th>
						<th>Amount</th>
						<th>Override</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="e in materialTable" :key="e.ticker">
						<td>
							<n-checkbox
								v-model:checked="e.active"
								:on-update:checked="
									(value: boolean) => {
										if (value)
											refMaterialInactives.delete(
												e.ticker
											);
										else refMaterialInactives.add(e.ticker);
									}
								" />
						</td>
						<td><MaterialTile :ticker="e.ticker" /></td>
						<td>{{ formatAmount(e.stock) }}</td>
						<td>{{ formatNumber(e.delta) }}</td>
						<td>
							<span
								:class="
									getBurnDisplayClass(e.burn).value != ''
										? `${
												getBurnDisplayClass(e.burn)
													.value
										  } px-2 py-[3px]`
										: ''
								">
								{{ formatNumber(e.burn) }}
							</span>
						</td>
						<td>{{ formatAmount(e.total) }}</td>
						<td>
							<n-input-number
								v-model:value="refMaterialOverrides[e.ticker]"
								size="tiny"
								:min="0"
								placeholder="0"
								class="max-w-[100px]" />
						</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td colspan="7">
							<div class="flex flex-row justify-between">
								<div>
									Total Weight:
									{{
										formatNumber(
											totalWeightVolume.totalWeight
										)
									}}
									t
								</div>
								<div>
									Total Volume:
									{{
										formatNumber(
											totalWeightVolume.totalVolume
										)
									}}
									m³
								</div>
							</div>
						</td>
					</tr>
				</tfoot>
			</n-table>
		</n-drawer-content>
	</n-drawer>
</template>
