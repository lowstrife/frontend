<script setup lang="ts">
	import { ref, Ref } from "vue";

	// Components
	import WrapperGameDataLoader from "@/features/wrapper/components/WrapperGameDataLoader.vue";
	import WrapperPlanningDataLoader from "@/features/wrapper/components/WrapperPlanningDataLoader.vue";
	import HelpDrawer from "@/features/help/components/HelpDrawer.vue";
	import CXPreferenceSelector from "@/features/exchanges/components/CXPreferenceSelector.vue";

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
					<n-form
						size="small"
						label-placement="left"
						label-width="auto"
						label-align="left">
						<n-form-item label="CX Preference">
							<CXPreferenceSelector
								:cx-uuid="refSelectedCXUuid"
								@update:cxuuid="
									(value) => (refSelectedCXUuid = value)
								" />
						</n-form-item>
					</n-form>
					<HelpDrawer file-name="tools_government" />
				</div>
			</div>

			<div class="px-6 py-3">
				{{ refSelectedCXUuid }}
			</div>
		</div>
	</WrapperGameDataLoader>
</template>
