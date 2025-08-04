<script setup lang="ts">
	import { defineAsyncComponent } from "vue";

	// Components
	const HomepageHeader = defineAsyncComponent(
		() => import("@/features/homepage/components/HomepageHeader.vue")
	);
	const NavigationBar = defineAsyncComponent(
		() => import("@/features/navigation/components/NavigationBar.vue")
	);
	const MobileToggle = defineAsyncComponent(
		() => import("@/features/navigation/components/MobileToggle.vue")
	);

	// Stores
	import { useUserStore } from "@/stores/userStore";
	const userStore = useUserStore();

	// UI
	import { useLoadingBar } from "naive-ui";

	// Loading Bars
	import router from "./router";
	const loadingBar = useLoadingBar();

	router.beforeEach((to, _, next) => {
		if (to.name) loadingBar.start();
		next();
	});

	router.afterEach((to) => {
		if (to.name) loadingBar.finish();
	});
</script>

<template>
	<main class="flex h-view w-full !bg-black text-white/80">
		<template v-if="userStore.isLoggedIn">
			<NavigationBar />
			<div class="flex flex-col flex-1 overflow-y-auto">
				<div class="h-screen text-white/80">
					<MobileToggle />
					<RouterView />
					<footer
						class="sticky top-[100vh] text-white/50 text-[10px] text-end hover:cursor-pointer pr-3 py-1">
						<router-link :to="'/imprint-tos'">
							Imprint & Terms of Service
						</router-link>
					</footer>
				</div>
			</div>
		</template>
		<template v-else>
			<div class="flex flex-col flex-1">
				<div class="h-screen text-white/80">
					<HomepageHeader />
					<RouterView />
					<footer
						class="sticky top-[100vh] text-white/50 text-[10px] text-end hover:cursor-pointer pr-3 py-1">
						<router-link :to="'/imprint-tos'">
							Imprint & Terms of Service
						</router-link>
					</footer>
				</div>
			</div>
		</template>
	</main>
</template>
