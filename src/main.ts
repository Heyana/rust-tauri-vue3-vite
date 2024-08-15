import { createApp } from "vue";
import App from "./App";
import router from "./router";
// import "@/src/style/index.scss";
import "element-plus/dist/index.css";

createApp(App).use(router).mount("#app");
