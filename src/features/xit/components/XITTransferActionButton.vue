<script setup lang="ts">
	import { nextTick, PropType, ref, Ref } from "vue";

	// Composables
	import { useXITAction } from "@/features/xit/useXITAction";
	const { transferJSON } = useXITAction();
	import { usePreferences } from "@/features/preferences/usePreferences";
	const { burnOrigin, defaultBuyItemsFromCX } = usePreferences();

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Util
	import { copyToClipboard } from "@/util/data";
	import { formatAmount } from "@/util/numbers";

	// Constants
	import { XITSTATIONWAREHOUSES } from "@/features/xit/xitConstants";

	// Types & Interfaces
	import { IXITTransferMaterial } from "@/features/xit/xitAction.types";

	// UI
	import { PButton, PCheckbox } from "@/ui";
	import {
		NDrawer,
		NDrawerContent,
		NTable,
		NForm,
		NFormItem,
		NInput,
		NSelect,
	} from "naive-ui";

	defineProps({
		elements: {
			type: Array as PropType<IXITTransferMaterial[]>,
			required: true,
		},
		transferName: {
			type: String,
			required: false,
			default: "Transfer",
		},
		// Button Definitions
		buttonText: {
			type: String,
			required: false,
			default: "XIT",
		},
		buttonSize: {
			type: String as PropType<"sm" | "md">,
			required: false,
			default: "md",
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

	function show(): void {
		if (!showDrawer.value) {
			loadDrawer.value = true;
			nextTick().then(() => (showDrawer.value = true));
		}
	}
</script>

<template>
	<PButton
		:size="buttonSize"
		:type="buttonSecondary ? 'secondary' : 'primary'"
		@click="show">
		{{ buttonText }}
	</PButton>

	<n-drawer v-if="loadDrawer" v-model:show="showDrawer" :width="drawerWidth">
		<n-drawer-content closable body-class="bg-black">
			<template #header> {{ drawerTitle }} </template>

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
				<n-form-item label="Buy Items From CX">
					<PCheckbox
						v-model:checked="defaultBuyItemsFromCX"
						:disabled="burnOrigin === 'Configure on Execution'" />

					<p
						v-if="burnOrigin === 'Configure on Execution'"
						class="p-3">
						Requires origin warehouse to purchase
					</p>
				</n-form-item>
				<n-form-item label="JSON">
					<n-input
						v-model:value="
							transferJSON(elements, {
								name: transferName,
								origin: burnOrigin,
								buy: defaultBuyItemsFromCX,
							}).value
						"
						size="small"
						type="textarea" />
					<PButton
						class="!ml-1"
						@click="
							copyToClipboard(
								transferJSON(elements, {
									name: transferName,
									origin: burnOrigin,
									buy: defaultBuyItemsFromCX,
								}).value
							)
						">
						Copy
					</PButton>
				</n-form-item>
			</n-form>

			<n-table striped class="mt-3">
				<thead>
					<tr>
						<th>Ticker</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="element in elements"
						:key="`TRANSFER#${element.ticker}`">
						<td><MaterialTile :ticker="element.ticker" /></td>
						<td>{{ formatAmount(element.value) }}</td>
					</tr>
				</tbody>
			</n-table>
		</n-drawer-content>
	</n-drawer>
</template>
