<script setup lang="ts">
	import { buttonGroupConfig } from "@/ui/styles";
	const { vertical = false } = defineProps<{ vertical?: boolean }>();
</script>

<template>
	<div
		class="pbuttongroup flex"
		:class="
			vertical ? buttonGroupConfig.vertical : buttonGroupConfig.horizontal
		">
		<slot />
	</div>
</template>
