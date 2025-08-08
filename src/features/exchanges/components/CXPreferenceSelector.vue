<script setup lang="ts">
	import { computed, WritableComputedRef } from "vue";

	// Composables
	import { useCXData } from "@/features/cx/useCXData";

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
	});

	const emit = defineEmits<{
		(e: "update:cxuuid", value: string | undefined): void;
	}>();

	const localCXUuid: WritableComputedRef<string | undefined> = computed({
		get: () => props.cxUuid,
		set: (value: string | undefined) => emit("update:cxuuid", value),
	});

	const preferenceOptions: SelectMixedOption[] =
		useCXData().getPreferenceOptions(true);
</script>

<template>
	<n-select
		v-model:value="localCXUuid"
		:options="preferenceOptions"
		clearable
		filterable
		:class="selectClass" />
</template>
