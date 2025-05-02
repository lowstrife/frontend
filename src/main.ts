import { createApp } from "vue";
import "@/assets/css/style.css";
import App from "./App.vue";

// stores
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// routing
import { router } from "./router/router";

// app + uses
const app = createApp(App);

app.use(router);
app.use(pinia);

// axios
import axiosSetup from "@/util/axiosSetup";

axiosSetup();

// highcharts
import HighChartsVue from "highcharts-vue";

import * as Highcharts from "highcharts";
import { highchartsOptions } from "@/layout/highcartsOptions";

Highcharts.setOptions(highchartsOptions);

app.use(HighChartsVue);

// mount
app.mount("#app");
