<script setup lang="ts">
	// Components
	import HelpDrawer from "@/features/help/components/HelpDrawer.vue";
</script>

<template>
	<div class="min-h-screen flex flex-col">
		<div
			class="px-6 py-3 border-b border-white/10 flex flex-row justify-between">
			<h1 class="text-2xl font-bold my-auto">Planet Search</h1>
			<HelpDrawer file-name="planet_search" />
		</div>

		<div class="border-b border-white/10">
			<div
				class="grid grid-cols-1 lg:grid-cols-[20%_auto] gap-3 divide-x divide-white/10">
				<div class="px-6 py-3">
					<h2 class="text-lg font-bold my-auto pb-3">
						Plan Name or ID
					</h2>
				</div>
				<div class="px-3 py-3">
					<h2 class="text-lg font-bold my-auto pb-3">
						Advanced Search
					</h2>
				</div>
			</div>
		</div>
		<div class="child:px-6 child:py-3">
			<div>Results</div>
		</div>
	</div>
</template>
