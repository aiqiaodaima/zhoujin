import { UserLayout, TabLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'

/**
 * 走菜单，走权限控制
 * @type {[null,null]}
 */
export const asyncRouterMap = [

  {
    path: '/',
    name: 'home',
    component: TabLayout,
    meta: { title: '首页' },
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home'),
        meta: {title: '首页', icon:'home'},
      },
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  },
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    name: 'dashboard',
    component: TabLayout,
    meta: { title: '首页' },
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */'@/views/Home'),
        meta: {title: '首页'},
      },
    ]
    },
  {
    path: '/user',
    component: UserLayout,
    name: 'user',
    redirect: '/user/loginFts',
    // hidden: true,
    children: [
      {
        path: 'loginFts',
        name: 'loginFts',
        component: () => import( /* webpackChunkName: "loginFts" */'@/views/user/LoginFTS')
      },
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/test',
    children: [
      {
        path: 'test',
        name: 'test',
        component: () => import('@/views/Test')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

]
