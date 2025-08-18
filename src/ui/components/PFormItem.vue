<script setup lang="ts">
	import { formItemConfig } from "@/ui/styles";
	const { label } = defineProps<{ label: string }>();
</script>

<template>
	<div :class="formItemConfig.label">
		{{ label }}
	</div>
	<div :class="formItemConfig.content">
		<slot />
	</div>
</template>
