<script setup lang="ts">
	import { computed, PropType } from "vue";

	// UI
	import { PButton, PButtonGroup } from "@/ui";
	import { NForm, NFormItem, NSelect } from "naive-ui";

	// Types & Interfaces
	import { SelectMixedOption } from "naive-ui/es/select/src/interface";

	const props = defineProps({
		loadBalance: {
			type: Boolean,
			required: true,
		},
		hideConsumables: {
			type: Boolean,
			required: true,
		},
		filterMaterials: {
			type: Array as PropType<string[]>,
			required: true,
		},
		filterPlanets: {
			type: Array as PropType<string[]>,
			required: true,
		},
		materialOptions: {
			type: Array as PropType<SelectMixedOption[]>,
			required: true,
		},
		planetOptions: {
			type: Array as PropType<SelectMixedOption[]>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(e: "applyFilter"): void;
		(e: "update:loadBalance", value: boolean): void;
		(e: "update:hideConsumables", value: boolean): void;
		(e: "update:filterMaterials", value: string[]): void;
		(e: "update:filterPlanets", value: string[]): void;
	}>();

	const localLoadBalance = computed({
		get: () => props.loadBalance,
		set: (v: boolean) => {
			emit("update:loadBalance", v);
			emit("applyFilter");
		},
	});

	const localHideConsumables = computed({
		get: () => props.hideConsumables,
		set: (v: boolean) => {
			emit("update:hideConsumables", v);
			emit("applyFilter");
		},
	});

	const localFilterMaterials = computed({
		get: () => props.filterMaterials,
		set: (v: string[]) => {
			emit("update:filterMaterials", v);
			emit("applyFilter");
		},
	});

	const localFilterPlanets = computed({
		get: () => props.filterPlanets,
		set: (v: string[]) => {
			emit("update:filterPlanets", v);
			emit("applyFilter");
		},
	});
</script>

<template>
	<n-form
		label-placement="left"
		label-width="auto"
		label-align="left"
		size="small">
		<div class="flex flex-row gap-6 flex-wrap">
			<div>
				<n-form-item label="Display">
					<PButtonGroup>
						<PButton
							:type="localLoadBalance ? 'secondary' : 'primary'"
							@click="
								() => (localLoadBalance = !localLoadBalance)
							">
							All
						</PButton>
						<PButton
							:type="!localLoadBalance ? 'secondary' : 'primary'"
							@click="
								() => (localLoadBalance = !localLoadBalance)
							">
							Loadbalance
						</PButton>
					</PButtonGroup>
				</n-form-item>
				<n-form-item label="Consumables">
					<PButtonGroup>
						<PButton
							:type="
								localHideConsumables ? 'secondary' : 'primary'
							"
							@click="
								() =>
									(localHideConsumables =
										!localHideConsumables)
							">
							Show
						</PButton>
						<PButton
							:type="
								!localHideConsumables ? 'secondary' : 'primary'
							"
							@click="
								() =>
									(localHideConsumables =
										!localHideConsumables)
							">
							Hide
						</PButton>
					</PButtonGroup>
				</n-form-item>
			</div>
			<div class="flex-grow">
				<n-form-item label="Materials">
					<n-select
						v-model:value="localFilterMaterials"
						multiple
						filterable
						clearable
						:options="materialOptions" />
				</n-form-item>
				<n-form-item label="Planets">
					<n-select
						v-model:value="localFilterPlanets"
						multiple
						filterable
						clearable
						:options="planetOptions" />
				</n-form-item>
			</div>
		</div>
	</n-form>
</template>
