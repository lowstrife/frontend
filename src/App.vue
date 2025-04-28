<script setup lang="ts">
	// Theme
	import { NConfigProvider, NModalProvider, darkTheme } from "naive-ui";
	import { prunplannerTheme } from "@/layout/prunplannerNaiveUI";

	// Components
	import HomepageView from "@/views/HomepageView.vue";
	import NavigationBar from "@/features/navigation/components/NavigationBar.vue";
	import MobileToggle from "@/features/navigation/components/MobileToggle.vue";
	import GameDataWrapper from "@/features/game_data/components/GameDataWrapper.vue";

	// Stores
	import { useUserStore } from "@/stores/userStore";

	const userStore = useUserStore();
</script>

<template>
	<n-config-provider :theme="darkTheme" :theme-overrides="prunplannerTheme">
		<n-modal-provider>
			<main class="flex h-screen w-full bg-black text-white/80">
				<template v-if="userStore.isLoggedIn">
					<NavigationBar />
					<div class="flex flex-col flex-1 overflow-y-auto">
						<div class="h-screen text-white/80">
							<MobileToggle />
							<GameDataWrapper
								:load-materials="true"
								:load-exchanges="true"
								:load-recipes="true"
								:load-buildings="true"
								:load-planet="'OT-580c'"
							>
								<RouterView />
							</GameDataWrapper>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="flex flex-col flex-1 overflow-y-auto">
						<HomepageView />
					</div>
				</template>
			</main>
		</n-modal-provider>
	</n-config-provider>
</template>
