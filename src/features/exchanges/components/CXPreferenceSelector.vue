<script setup lang="ts">
	import { ref, Ref, watch } from "vue";

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

	const localCXUuid: Ref<string | undefined> = ref(props.cxUuid);

	const preferenceOptions: SelectMixedOption[] =
		useCXData().getPreferenceOptions(true);

	watch(
		() => props.cxUuid,
		(newValue: string | undefined) => (localCXUuid.value = newValue)
	);
</script>

<template>
	<n-select
		v-model:value="localCXUuid"
		:options="preferenceOptions"
		clearable
		filterable
		:class="selectClass"
		@update-value="(value: string | undefined) => emit('update:cxuuid', value)" />
</template>
