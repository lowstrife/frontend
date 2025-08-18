<script setup lang="ts">
	import { SizeKey } from "@/ui/ui.types";
	import { inputConfig } from "@/ui/styles";

	const value = defineModel<string | null | undefined>("value", {
		required: true,
	});
	const {
		disabled = false,
		size = "md",
		placeholder = "Please Input",
	} = defineProps<{
		disabled?: boolean;
		size?: SizeKey;
		placeholder?: string;
	}>();

	function onInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value.value = target.value;
	}
</script>

<template>
	<div>
		<div
			:class="`${inputConfig.container} ${inputConfig.sizes[size].container}`">
			<input
				name="pinput"
				:disabled="disabled"
				type="text"
				:value="value"
				:placeholder="placeholder"
				:class="`${inputConfig.sizes[size].input}`"
				@input="onInput" />
		</div>
	</div>
</template>
