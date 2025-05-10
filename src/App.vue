<script setup lang="ts">
	import { defineAsyncComponent } from "vue";

	// Theme
	import { NConfigProvider, NModalProvider, darkTheme } from "naive-ui";
	import { prunplannerTheme } from "@/layout/prunplannerNaiveUI";

	// Components
	const HomepageHeader = defineAsyncComponent(() => import("@/features/homepage/components/HomepageHeader.vue"));;
	const NavigationBar = defineAsyncComponent( () => import("@/features/navigation/components/NavigationBar.vue"));
	const MobileToggle = defineAsyncComponent( () => import("@/features/navigation/components/MobileToggle.vue"));

	// Stores
	import { useUserStore } from "@/stores/userStore";
	const userStore = useUserStore();
</script>

<template>
	<n-config-provider :theme="darkTheme" :theme-overrides="prunplannerTheme">
		<n-modal-provider>
			<main class="flex h-view w-full !bg-black text-white/80">
				<template v-if="userStore.isLoggedIn">
					<NavigationBar />
					<div class="flex flex-col flex-1 overflow-y-auto">
						<div class="h-screen text-white/80">
							<MobileToggle />
							<RouterView />
						</div>
					</div>
				</template>
				<template v-else>
					<div class="flex flex-col flex-1">
						<div class="h-screen text-white/80">
							<HomepageHeader />
							<RouterView />
						</div>
					</div>
				</template>
			</main>
		</n-modal-provider>
	</n-config-provider>
</template>
