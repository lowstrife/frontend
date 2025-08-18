<script setup lang="ts">
	import { checkboxConfig } from "@/ui/styles";
	const checked = defineModel<boolean>("checked");

	const { disabled = false } = defineProps<{ disabled?: boolean }>();
</script>

<template>
	<div class="pcheckbox" :class="checkboxConfig.container">
		<label :class="checkboxConfig.label">
			<input
				:disabled="disabled"
				v-model="checked"
				type="checkbox"
				:class="checkboxConfig.input" />
			<span :class="checkboxConfig.checkIcon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					:class="checkboxConfig.checkIconSVG"
					viewBox="0 0 20 20"
					fill="currentColor"
					stroke="currentColor"
					stroke-width="1">
					<path
						fill-rule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clip-rule="evenodd"></path>
				</svg>
			</span>
		</label>
	</div>
</template>
