<script setup lang="ts">
	import { ref, onBeforeUnmount, nextTick } from "vue";
	import { createPopper, Instance } from "@popperjs/core";

	const props = defineProps<{
		placement?: "top" | "bottom" | "left" | "right";
		offset?: number;
	}>();

	const triggerRef = ref<HTMLElement | null>(null);
	const tooltipRef = ref<HTMLElement | null>(null);
	let popperInstance: Instance | null = null;
	const isVisible = ref(false);

	async function show() {
		isVisible.value = true;

		await nextTick(); // ensure tooltip is rendered before Popper is created

		if (triggerRef.value && tooltipRef.value) {
			popperInstance = createPopper(triggerRef.value, tooltipRef.value, {
				placement: props.placement ?? "left",
				modifiers: [
					{
						name: "offset",
						options: { offset: [0, props.offset ?? 8] },
					},
					{
						name: "flip",
						options: { fallbackPlacements: ["top", "bottom"] },
					},
					{ name: "preventOverflow", options: { padding: 8 } },
				],
			});
		}
	}

	function hide() {
		isVisible.value = false;
		if (popperInstance) {
			popperInstance.destroy();
			popperInstance = null;
		}
	}

	onBeforeUnmount(() => {
		if (popperInstance) {
			popperInstance.destroy();
			popperInstance = null;
		}
	});
</script>

<template>
	<div
		ref="triggerRef"
		class="ptooltip flex flex-1"
		@mouseenter="show"
		@mouseleave="hide">
		<slot name="trigger"></slot>
	</div>

	<Teleport to="body">
		<div
			v-if="isVisible"
			ref="tooltipRef"
			class="z-99 p-1 text-sm text-white bg-black/90 border border-white/20 rounded shadow-lg">
			<slot />
		</div>
	</Teleport>
</template>
