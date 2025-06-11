<script setup lang="ts">
	// Components
	import StorageData from "@/features/profile/components/StorageData.vue";
</script>

<template>
	<div class="min-h-screen flex flex-col">
		<div class="px-6 py-3 border-b border-white/10">
			<h1 class="text-2xl font-bold my-auto">Profile</h1>
		</div>

		<div
			class="flex-grow grid grid-cols-1 lg:grid-cols-[25%_25%_auto] gap-3 divide-x divide-white/10 child:px-6 child:py-3">
			<div><StorageData /></div>
			<div>
				<h2 class="text-white/80 font-bold text-lg my-auto">Profile</h2>
			</div>
			<div>
				<h2 class="text-white/80 font-bold text-lg my-auto">
					Release Notes
				</h2>
			</div>
		</div>
	</div>
</template>
