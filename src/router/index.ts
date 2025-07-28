import {
	createWebHistory,
	createRouter,
	NavigationGuardNext,
	RouteLocationRaw,
} from "vue-router";

// Stores
import { useUserStore } from "@/stores/userStore";

// Composables
import { usePostHog } from "@/lib/usePostHog";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			name: "homepage",
			path: "/",
			component: () => import("@/views/HomepageView.vue"),
			props: true,
		},
		{
			name: "profile",
			path: "/profile",
			meta: { requiresAuth: true },
			component: () => import("@/views/ProfileView.vue"),
			props: true,
		},
		{
			name: "empire",
			path: "/empire/:empireUuid?",
			meta: { requiresAuth: true },
			component: () => import("@/views/EmpireView.vue"),
			props: true,
		},
		{
			name: "manage",
			path: "/manage",
			meta: { requiresAuth: true },
			component: () => import("@/views/ManageView.vue"),
		},
		{
			name: "exchanges",
			path: "/exchanges/:cxUuid?",
			meta: { requiresAuth: true },
			component: () => import("@/views/ExchangesView.vue"),
			props: true,
		},
		{
			name: "search",
			path: "/search",
			meta: { requiresAuth: true },
			component: () => import("@/views/PlanetSearchView.vue"),
		},
		{
			name: "none",
			path: "/none",
			meta: { requiresAuth: true },
			component: import("@/views/EmpireView.vue"),
		},
		{
			name: "plan",
			path: "/plan/:planetNaturalId/:planUuid?",
			meta: { requiresAuth: true },
			component: () => import("@/views/PlanLoadView.vue"),
			props: true,
		},
		{
			name: "shared-plan",
			path: "/shared/:sharedPlanUuid",
			meta: { showHeaderName: true },
			component: () => import("@/views/PlanLoadView.vue"),
			props: true,
		},
		{
			name: "fio-repair",
			path: "/fio/repair",
			meta: { requiresAuth: true },
			component: () => import("@/views/fio/FIORepairView.vue"),
		},
		{
			name: "fio-burn",
			path: "/fio/burn",
			meta: { requiresAuth: true },
			component: () => import("@/views/fio/FIOBurnView.vue"),
		},
		{
			name: "api",
			path: "/api",
			meta: { requiresAuth: true },
			component: () => import("@/lib/query_cache/QueryCacheView.vue"),
		},
	],
});

router.beforeEach((to, _, next: NavigationGuardNext) => {
	const userStore = useUserStore();

	if (to.meta.requiresAuth && !userStore.isLoggedIn) {
		const redirectTo: RouteLocationRaw = {
			name: "homepage",
			state: { showLogin: "true" },
		};
		next(redirectTo);
	} else if (to.name === "homepage" && userStore.isLoggedIn) {
		const redirectTo: RouteLocationRaw = {
			name: "empire",
		};
		next(redirectTo);
	} else {
		next();
	}
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { posthog } = usePostHog();

export default router;
