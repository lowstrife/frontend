import { createWebHistory, createRouter } from "vue-router";

const routes = [
	{ path: "/", component: () => import("@/views/EmpireView.vue") },
	{ path: "/none", component: import("@/views/EmpireView.vue") },
	{
		path: "/plan/:planetNaturalId/:planUuid?",
		component: () => import("@/views/PlanLoadView.vue"),
		props: true,
	},
	{
		path: "/shared/:sharedPlanUuid",
		component: () => import("@/views/PlanLoadView.vue"),
		props: true,
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
