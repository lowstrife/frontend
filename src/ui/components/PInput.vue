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
		rows = 5,
		type = "input",
	} = defineProps<{
		disabled?: boolean;
		size?: SizeKey;
		placeholder?: string;
		rows?: number;
		type?: "input" | "textarea";
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
				v-if="type === 'input'"
				name="pinput-input"
				:disabled="disabled"
				type="text"
				:value="value"
				:placeholder="placeholder"
				:class="`${inputConfig.sizes[size].input}`"
				@input="onInput" />
			<textarea
				v-if="type === 'textarea'"
				name="pinput-textarea"
				:disabled="disabled"
				type="text"
				:value="value"
				:rows="rows"
				:placeholder="placeholder"
				:class="`${inputConfig.sizes[size].input}`"
				@input="onInput" />
		</div>
	</div>
</template>
