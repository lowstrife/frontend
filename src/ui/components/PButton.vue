<script setup lang="ts">
	import { PropType } from "vue";

	import { ColorKey, SizeKey } from "@/ui/ui.types";
	import { buttonConfig } from "@/ui/styles";

	const props = defineProps({
		loading: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		size: { type: String as PropType<SizeKey>, default: "md" },
		type: { type: String as PropType<ColorKey>, default: "primary" },
	});

	defineEmits<{
		(e: "click"): void;
	}>();

	const buttonBase: string = [
		buttonConfig.base,
		buttonConfig.sizes[props.size].base,
		buttonConfig.colors[props.type].base,
		buttonConfig.colors[props.type].hover,
		buttonConfig.colors[props.type].disabled,
	].join(" ");

	const iconClass: string = [
		buttonConfig.iconBase,
		buttonConfig.sizes[props.size].icon,
	].join(" ");
</script>

<template>
	<button
		:class="buttonBase"
		:disabled="disabled"
		:aria-busy="loading ? 'true' : 'false'"
		@click="$emit('click')">
		<span
			v-if="loading"
			key="spinner"
			:class="iconClass"
			aria-hidden="true">
			<svg
				class="spinner"
				:class="buttonConfig.sizes[size].spinner"
				viewBox="0 0 50 50"
				focusable="false"
				aria-hidden="true">
				<circle
					class="path"
					cx="25"
					cy="25"
					r="20"
					fill="none"
					stroke-width="4" />
			</svg>
		</span>

		<span v-if="$slots.icon" key="icon" :class="iconClass">
			<slot name="icon" />
		</span>

		<!-- default slot for content -->
		<slot />
	</button>
</template>

<style scoped>
	/* Media container keeps layout consistent (icon/spinner) */

	/* Spinner visuals */
	.spinner {
		animation: rotate 1s linear infinite;
	}
	.path {
		stroke: currentColor;
		stroke-linecap: round;
		animation: dash 1.4s ease-in-out infinite;
	}

	/* spinner keyframes */
	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes dash {
		0% {
			stroke-dasharray: 1, 150;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -124;
		}
	}
</style>
