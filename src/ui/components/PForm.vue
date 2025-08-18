<script setup lang="ts">
	import { formConfig } from "@/ui/styles";
</script>

<template>
	<div :class="formConfig.container">
		<slot />
	</div>
</template>
