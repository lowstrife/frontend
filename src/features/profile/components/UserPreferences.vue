<script setup lang="ts">
	import { onMounted, ref, Ref } from "vue";

	// Stores
	import { usePlanningStore } from "@/stores/planningStore";

	// Composables
	import { usePreferences } from "@/features/preferences/usePreferences";
	import { usePlanPreferences } from "@/features/preferences/usePlanPreferences";

	// UI
	import {
		NForm,
		NFormItem,
		NInput,
		NSelect,
		NInputNumber,
		NCheckbox,
		NButton,
	} from "naive-ui";
	import { SelectMixedOption } from "naive-ui/es/select/src/interface";

	const planningStore = usePlanningStore();
	const { burnDaysRed, burnDaysYellow, planSettings } = usePreferences();
	let { defaultEmpireUuid } = usePreferences();

	const empireOptions: Ref<SelectMixedOption[]> = ref(
		Object.values(planningStore.empires).map((e) => {
			return {
				label: e.name,
				value: e.uuid,
			};
		})
	);

	onMounted(() => {
		// ensure defaultEmpire is still in the empire list
		const validDefaultEmpire: boolean = empireOptions.value.find(
			(e) => e.value === defaultEmpireUuid.value
		)
			? true
			: false;
		if (!validDefaultEmpire) {
			// if there empires, use first
			if (empireOptions.value.length > 0)
				defaultEmpireUuid.value = empireOptions.value[0]
					.value as string;
			// or, reset to undefined
			else defaultEmpireUuid.value = undefined;
		}
		// all plans loaded, include a function that clears up non-existing plans preferences
	});
</script>

<template>
	<h2 class="text-white/80 font-bold text-lg my-auto">Preferences</h2>
	<div class="py-3 text-white/60">
		Your preferences are saved locally in your browser and aren't synced
		with the backend yet. Use this panel to review and customize your
		PRUNplanner settings.
	</div>
	<h3 class="font-bold pb-3">Tool Preferences</h3>
	<n-form
		label-placement="left"
		label-width="auto"
		label-align="left"
		size="small">
		<n-form-item label="Default Empire">
			<n-select
				:options="empireOptions"
				v-model:value="defaultEmpireUuid"
				v-on:update:value="
					(value: string | undefined) => {
						if (value) {
							defaultEmpireUuid = value;
						}
					}
				" />
		</n-form-item>
		<n-form-item label="Burn Red Threshold">
			<n-input-number
				v-model:value="burnDaysRed"
				show-button
				:min="1"
				class="w-full" />
		</n-form-item>
		<n-form-item label="Burn Yellow Threshold">
			<n-input-number
				v-model:value="burnDaysYellow"
				show-button
				:min="1"
				class="w-full" />
		</n-form-item>
	</n-form>

	<h3 class="font-bold py-3">Plan-Specific Settings</h3>
	<div class="pb-3 text-white/60">
		These settings are managed within individual plans. This section
		provides an overview of the preferences you've customized so far — to
		modify them, navigate to the corresponding plan.
	</div>

	{{ planSettings }}
</template>
