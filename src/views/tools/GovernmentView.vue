<script setup lang="ts">
	import { ref, Ref } from "vue";

	// Components
	import WrapperGameDataLoader from "@/features/wrapper/components/WrapperGameDataLoader.vue";
	import WrapperPlanningDataLoader from "@/features/wrapper/components/WrapperPlanningDataLoader.vue";
	import HelpDrawer from "@/features/help/components/HelpDrawer.vue";
	import CXPreferenceSelector from "@/features/exchanges/components/CXPreferenceSelector.vue";
	import GovernmentUpkeepPrices from "@/features/government/components/GovernmentUpkeepPrices.vue";

	// UI
	import { PForm, PFormItem } from "@/ui";

	const refSelectedCXUuid: Ref<string | undefined> = ref(undefined);
</script>

<template>
	<WrapperGameDataLoader load-exchanges>
		<WrapperPlanningDataLoader
			load-c-x
			@update:cx-uuid="(d) => (refSelectedCXUuid = d)">
		</WrapperPlanningDataLoader>
		<div class="min-h-screen flex flex-col">
			<div
				class="px-6 py-3 border-b border-white/10 flex flex-row justify-between">
				<h1 class="text-2xl font-bold my-auto">Government</h1>
				<div class="flex flex-row gap-x-3">
					<PForm>
						<PFormItem label="CX Preference">
							<CXPreferenceSelector
								class="w-[250px]"
								:cx-uuid="refSelectedCXUuid"
								@update:cxuuid="
									(value) => (refSelectedCXUuid = value)
								" />
						</PFormItem>
					</PForm>
					<HelpDrawer file-name="tools_government" />
				</div>
			</div>

			<div class="px-6 py-3">
				<GovernmentUpkeepPrices :cx-uuid="refSelectedCXUuid" />
			</div>
		</div>
	</WrapperGameDataLoader>
</template>
