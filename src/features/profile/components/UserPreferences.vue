<script setup lang="ts">
	import { onMounted, ref, Ref } from "vue";

	// Stores
	import { usePlanningStore } from "@/stores/planningStore";

	// Composables
	import { usePreferences } from "@/features/preferences/usePreferences";

	// Constants
	import { XITSTATIONWAREHOUSES } from "@/features/xit/xitConstants";

	// Types & Interfaces
	import { SelectMixedOption } from "naive-ui/es/select/src/interface";

	// Components
	import CXPreferenceSelector from "@/features/exchanges/components/CXPreferenceSelector.vue";

	// UI
	import { NTable, NForm, NFormItem, NSelect, NInputNumber } from "naive-ui";

	const planningStore = usePlanningStore();

	const {
		burnDaysRed,
		burnDaysYellow,
		burnResupplyDays,
		burnOrigin,
		planSettingsOverview,
		cleanPlanPreferences,
	} = usePreferences();
	let { defaultEmpireUuid, defaultCXUuid } = usePreferences();

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

		// all plans loaded, clear up non-existing plans preferences
		cleanPlanPreferences();
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
				v-model:value="defaultEmpireUuid"
				:options="empireOptions"
				@update:value="
					(value: string | undefined) => {
						if (value) {
							defaultEmpireUuid = value;
						}
					}
				" />
		</n-form-item>
		<n-form-item label="Default CX">
			<CXPreferenceSelector
				:cx-uuid="defaultCXUuid"
				:add-undefined-c-x="false" />
		</n-form-item>
		<h4 class="font-bold pb-3">FIO Burn</h4>
		<n-form-item label="Red Threshold">
			<n-input-number
				v-model:value="burnDaysRed"
				show-button
				:min="1"
				class="w-full" />
		</n-form-item>
		<n-form-item label="Yellow Threshold">
			<n-input-number
				v-model:value="burnDaysYellow"
				show-button
				:min="1"
				class="w-full" />
		</n-form-item>
		<n-form-item label="Resupply Days">
			<n-input-number
				v-model:value="burnResupplyDays"
				show-button
				:min="1"
				class="w-full" />
		</n-form-item>
		<n-form-item label="XIT Origin">
			<n-select
				v-model:value="burnOrigin"
				:options="XITSTATIONWAREHOUSES"
				class="w-full" />
		</n-form-item>
	</n-form>

	<h3 class="font-bold py-3">Plan-Specific Settings</h3>
	<div class="pb-3 text-white/60">
		These settings are managed within individual plans. This section
		provides an overview of the preferences you've customized so far — to
		modify them, navigate to the corresponding plan.
	</div>
	<n-table striped>
		<thead>
			<tr>
				<th>Plan</th>
				<th>Preferences</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="plan in planSettingsOverview" :key="plan.planUuid">
				<td>
					<router-link
						:to="`/plan/${plan.planetId}/${plan.planUuid}`"
						class="text-link-primary font-bold hover:underline">
						{{ plan.planName }}
					</router-link>
				</td>
				<td class="w-[50%] max-w-[75%]">
					{{ plan.preferences.join(", ") }}
				</td>
			</tr>
		</tbody>
	</n-table>
</template>
