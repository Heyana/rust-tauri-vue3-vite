import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import { routerMap } from '../constant';

const routes: RouteRecordRaw[] = routerMap;

const router = createRouter({
  history: createWebHashHistory(), // 只能用hash模式
  routes
});

export default router;
