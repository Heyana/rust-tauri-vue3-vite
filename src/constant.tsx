
export const routerMap = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    title: '上传',
    icon: 'icon-shangchuan-1',
    component: () => import('./views/Home')
  },
];

