<script setup lang="ts">
	import { computed, WritableComputedRef } from "vue";

	// Composables
	import { useCXData } from "@/features/cx/useCXData";
	import { usePreferences } from "@/features/preferences/usePreferences";

	// Types & Interfaces
	import { SelectMixedOption } from "naive-ui/es/select/src/interface";

	// UI
	import { NSelect } from "naive-ui";

	const props = defineProps({
		cxUuid: {
			type: String,
			required: false,
			default: undefined,
		},
		selectClass: {
			type: String,
			required: false,
			default: "",
		},
		addUndefinedCX: {
			type: Boolean,
			required: false,
			default: true,
		},
	});

	let { defaultCXUuid } = usePreferences();

	const emit = defineEmits<{
		(e: "update:cxuuid", value: string | undefined): void;
	}>();

	const localCXUuid: WritableComputedRef<string | undefined> = computed({
		get: () => (defaultCXUuid.value ? defaultCXUuid.value : props.cxUuid),
		set: (value: string | undefined) => {
			emit("update:cxuuid", value);
			defaultCXUuid.value = value;
		},
	});

	const preferenceOptions: SelectMixedOption[] =
		useCXData().getPreferenceOptions(props.addUndefinedCX);
</script>

<template>
	<n-select
		v-model:value="localCXUuid"
		:options="preferenceOptions"
		clearable
		filterable
		:class="selectClass" />
</template>
