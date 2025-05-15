<template>
	<!-- Mobile menu toggle button -->
	<input type="checkbox" id="menu-toggle" class="hidden peer" />
	<!-- Sidebar -->
	<div
		class="hidden peer-checked:flex md:flex border-r border-white/5 flex-col w-60 bg-gray-dark transition-all duration-300 ease-in-out"
	>
		<div class="items-center justify-between h-16 px-4 sm:hidden md:flex">
			<div class="flex w-full">
				<div class="flex-grow text-prunplanner text-xl font-light">
					<span class="font-bold">PRUN</span>planner
				</div>
				<div class="my-auto text-white/50 text-xs">v0.21</div>
			</div>
		</div>
		<div class="flex flex-col flex-1 overflow-y-auto">
			<nav class="flex-1 px-2 pt-0 pb-4 text-white/80">
				<template
					v-for="section in menuItems"
					:key="'SECTION#' + section.label"
				>
					<div class="pb-4">
						<div class="px-4 py-2 text-sm text-gray-400">
							{{ section.label }}
						</div>
						<template
							v-for="item in section.children"
							:key="'SECTION#' + section.label + '#' + item.label"
						>
							<!-- without children-->
							<RouterLink
								v-if="!item.children && item.routerLink"
								:to="item.routerLink"
								class="flex items-center px-4 py-2 hover:bg-white/20 hover:rounded-sm group"
								active-class="bg-white/10 rounded-sm"
								:key="'ROUTER#' + section.label + '#' + item.label"
							>
								<n-icon class="mr-2" size="20" v-if="item.icon">
									<component :is="item.icon" />
								</n-icon>
								{{ item.label }}
							</RouterLink>
							<template v-else-if="!item.children && item.functionCall">
								<div
									class="flex items-center px-4 py-2 hover:bg-white/20 hover:rounded-sm group hover:cursor-pointer"
									v-on:click="item.functionCall()"
								>
									<n-icon class="mr-2" size="20" v-if="item.icon">
										<component :is="item.icon" />
									</n-icon>
									<span>{{ item.label }}</span>
								</div>
							</template>
							<template v-else>
								<div class="relative group">
									<input
										type="checkbox"
										:id="item.label + '-toggle'"
										class="hidden peer"
									/>
									<label
										:for="item.label + '-toggle'"
										class="flex items-center px-4 py-2 hover:bg-white/20 hover:rounded-sm cursor-pointer w-full"
									>
										<n-icon class="mr-2" size="20" v-if="item.icon">
											<component :is="item.icon" />
										</n-icon>
										{{ item.label }}
										<!-- Arrow Icon -->
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 ml-auto transition-transform peer-checked:rotate-180 absolute right-4 top-3 transform #dis--translate-y-1/2 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</label>
									<div
										class="hidden peer-checked:flex transition-all flex-col duration-300"
									>
										<RouterLink
											v-for="children in item.children"
											:to="children.routerLink ? children.routerLink : ''"
											class="flex items-center px-4 py-2 hover:bg-white/20 hover:rounded-sm group"
											:class="children.icon ? 'pl-6' : 'pl-12'"
											active-class="bg-white/10 rounded-sm"
											:key="'ROUTER#' + children.label + '#' + children.label"
										>
											<n-icon class="mr-2" size="20" v-if="children.icon">
												<component :is="children.icon" />
											</n-icon>
											{{ children.label }}
										</RouterLink>
									</div>
								</div>
							</template>
						</template>
					</div>
				</template>
			</nav>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { IMenuSection } from "@/features/navigation/navigation.types";
	import { useUserStore } from "@/stores/userStore";

	import router from "@/router";

	// UI
	import { NIcon } from "naive-ui";

	// Icons
	import {
		HomeSharp,
		SearchRound,
		SettingsRound,
		ApiSharp,
		LogOutRound,
		GroupWorkRound,
		ShoppingBasketSharp,
		PermDataSettingSharp,
		CandlestickChartSharp,
		UpgradeSharp,
		CompareSharp,
		ProductionQuantityLimitsSharp,
		StarsSharp,
		PersonSharp,
		HelpOutlineSharp,
		ExtensionSharp,
	} from "@vicons/material";

	const userStore = useUserStore();

	const menuItems: IMenuSection[] = [
		{
			label: "Home",
			children: [
				{
					label: "Empire",
					routerLink: "/",
					icon: HomeSharp,
				},
				{
					label: "Planet Search",
					routerLink: "/none",
					icon: SearchRound,
				},
				{
					label: "Projects",
					routerLink: "/none",
					icon: GroupWorkRound,
				},
			],
		},
		{
			label: "Configuration",
			children: [
				{
					label: "Empire Management",
					routerLink: "/none",
					icon: SettingsRound,
				},
				{
					label: "Exchanges",
					routerLink: "/none",
					icon: ShoppingBasketSharp,
				},
				{
					label: "Project Settings",
					routerLink: "/none",
					icon: PermDataSettingSharp,
				},
			],
		},

		{
			label: "Tools",
			children: [
				{
					label: "Market Data",
					routerLink: "/none",
					icon: CandlestickChartSharp,
					children: [
						{
							label: "Market Exploration",
							routerLink: "/none",
						},
						{
							label: "ROI Overview",
							routerLink: "/none",
						},
						{
							label: "Resource ROI Overview",
							routerLink: "/none",
						},
					],
				},
				{
					label: "HQ Upgrade Calculator",
					routerLink: "/none",
					icon: ProductionQuantityLimitsSharp,
				},
				{
					label: "Production Chains",
					routerLink: "/none",
					icon: CompareSharp,
				},
				{
					label: "Base Compare",
					routerLink: "/none",
					icon: UpgradeSharp,
				},
				{
					label: "Government",
					routerLink: "/none",
					icon: StarsSharp,
				},
				{
					label: "FIO",
					routerLink: "/none",
					icon: ApiSharp,
					children: [
						{
							label: "Burn",
							routerLink: "/none",
						},
						{
							label: "Storage",
							routerLink: "/none",
						},
						{
							label: "Repair",
							routerLink: "/none",
						},
						{
							label: "Plan Import",
							routerLink: "/none",
						},
					],
				},
			],
		},
		{
			label: "Account",
			children: [
				{
					label: "API",
					routerLink: "/none",
					icon: ExtensionSharp,
				},
				{
					label: "Profile",
					routerLink: "/none",
					icon: PersonSharp,
				},
				{
					label: "Help",
					routerLink: "/none",
					icon: HelpOutlineSharp,
				},
				{
					label: "Logout",
					icon: LogOutRound,
					functionCall: () => {
						userStore.logout();
						router.push("/");
					},
				},
			],
		},
	];
</script>
