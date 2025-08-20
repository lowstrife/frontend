<script setup lang="ts">
	import { computed } from "vue";

	// Composables
	import { useUpkeepPrice } from "@/features/government/useUpkeepPrice";

	// Components
	import UpkeepMaterialTable from "@/features/government/components/UpkeepMaterialTable.vue";

	// Types & Interfaces
	import { POPIEffects } from "@/features/government/government.types";

	const props = defineProps<{ cxUuid: string | undefined }>();
	const localCxUuid = computed(() => props.cxUuid);

	const { effectData } = useUpkeepPrice(localCxUuid);
</script>

<template>
	<h2 class="text-2xl pb-3">
		Material Price Calculations for Population Upkeep
	</h2>
	<div class="grid grid-cols-1 2xl:grid-cols-3 gap-3">
		<div v-for="effect in POPIEffects" :key="effect">
			<UpkeepMaterialTable :data="effectData(effect).value" />
		</div>
	</div>
</template>
