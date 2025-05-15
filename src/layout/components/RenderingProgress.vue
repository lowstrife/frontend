<script setup lang="ts">
	// UI
	import { NSpin } from "naive-ui";

	defineProps({
		height: {
			type: Number,
			required: false,
		},
	});
</script>

<template>
	<div
		class="relative w-full bg-center bg-repeat bg-[url(/images/bg_striped_prunplanner.png)]"
		:class="height ? `h-[${height}px]` : 'h-full'"
	>
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="bg-black p-8 rounded shadow-lg text-center">
				<n-spin />
				<div class="pt-3">Rendering View</div>
			</div>
		</div>
	</div>
</template>
