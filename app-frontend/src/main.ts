import { createApp, inject } from "vue";
import "./style.scss";
import App from "./App.vue";
import { router } from "./lib/router";

createApp(App).use(router).mount("#app");
