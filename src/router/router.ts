import { createMemoryHistory, createRouter } from "vue-router";

import EmpireView from "../views/EmpireView.vue";

const routes = [
	{ path: "/", component: EmpireView },
	{ path: "/none", component: EmpireView },
];

export const router = createRouter({
	history: createMemoryHistory(),
	routes,
});
