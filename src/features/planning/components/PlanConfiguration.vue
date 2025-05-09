<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	// Types & Interfaces
	import { IPlanEmpire } from "@/stores/planningStore.types";

	import { SelectMixedOption } from "naive-ui/es/select/src/interface";

	// UI
	import { NForm, NFormItem, NInput, NSelect } from "naive-ui";

	const props = defineProps({
		disabled: {
			type: Boolean,
			required: true,
		},
		planName: {
			type: String,
			required: false,
		},
		empireOptions: {
			type: Array as PropType<IPlanEmpire[]>,
			required: false,
		},
		activeEmpire: {
			type: Object as PropType<IPlanEmpire>,
			required: false,
		},
		planEmpires: {
			type: Array as PropType<IPlanEmpire[]>,
			required: true,
		},
	});

	function createEmpireOptions(
		data: IPlanEmpire[] | undefined
	): SelectMixedOption[] {
		if (!data) return [];

		const selectOptions: SelectMixedOption[] = [];

		data.forEach((e: IPlanEmpire) => {
			// check if the option is also assigned to the plan
			// by trying to find it in planEmpires

			const pE: IPlanEmpire | undefined = props.planEmpires.find(
				(f) => f.uuid === e.uuid
			);

			selectOptions.push({
				label: pE ? `» ${e.name}` : e.name,
				value: e.uuid,
			});
		});

		return selectOptions.sort((a, b) =>
			(a.label as string) > (b.label as string) ? 1 : -1
		);
	}

	const emit = defineEmits<{
		(e: "update:active-empire", empireUuid: string): void;
		(e: "update:plan-name", value: string): void;
	}>();

	// Local State
	const localPlanName: Ref<string | undefined> = ref(props.planName);
	const localEmpireOptions: Ref<IPlanEmpire[] | undefined> = ref(
		props.empireOptions
	);
	const localActiveEmpireUuid: Ref<string | undefined> = ref(
		props.activeEmpire?.uuid
	);

	const empireSelectOptions: Ref<SelectMixedOption[]> = ref(
		createEmpireOptions(props.empireOptions)
	);

	// Prop Watcher
	watch(
		() => props.planName,
		(newName: string | undefined) => (localPlanName.value = newName)
	);
	watch(
		() => props.empireOptions,
		(newOptions: IPlanEmpire[] | undefined) => {
			if (newOptions) {
				localEmpireOptions.value = newOptions;
				empireSelectOptions.value = createEmpireOptions(newOptions);
			}
		}
	);
	watch(
		() => props.activeEmpire,
		(newActiveEmpire: IPlanEmpire | undefined) =>
			(localActiveEmpireUuid.value = newActiveEmpire?.uuid)
	);
</script>

<template>
	<n-form
		:disabled="disabled"
		label-placement="left"
		label-width="auto"
		label-align="left"
		size="small"
	>
		<n-form-item label="Name">
			<n-input
				v-model:value="localPlanName"
				placeholder="Plan Name"
				:on-update:value="(value: string) => emit('update:plan-name', value)"
			/>
		</n-form-item>
		<n-form-item label="Empire">
			<n-select
				:options="empireSelectOptions"
				v-model:value="localActiveEmpireUuid"
				:on-update:value="
					(value: string) => emit('update:active-empire', value)
				"
			/>
		</n-form-item>
	</n-form>
</template>
