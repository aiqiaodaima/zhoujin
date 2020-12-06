import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { generateIndexRouter } from "@/utils/util"

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/user/loginFts','/user/register', '/user/register-result','/user/alteration'] // no redirect whitelist

/* sunkebao路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 */
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  // if (isChunkLoadFailed) {
    console.log('错误跳回当前路由',error.message,router.history,router.history.pending)
    router.replace(targetPath);
    // window.location.reload();
    // window.location = '/home'
  // }
});

router.beforeEach((to, from, next) => {
  NProgress.start() 
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/loginFts') {
      next({path: '/home', name: 'home' })
      NProgress.done()
    } else {
      if (store.getters.permissionList.length === 0) {
        store.dispatch('GetPermissionList').then(res => {
            const menuData = res.result.menu;
            if (menuData === null || menuData === "" || menuData === undefined) {
              return;
            }
            let constRoutes = [];
            constRoutes = generateIndexRouter(menuData);
            // 添加主界面路由
            store.dispatch('UpdateAppRouter',  { constRoutes }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              console.log('登陆完成跳到home',to,to.path,redirect)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
              // next({ path: redirect })
              // next({path: '/home', name: 'home' })
            })
          })
        .catch(() => {
          /* notification.error({
            message: '系统提示',
            description: '请求用户信息失败，请重试！'
          })*/
          store.dispatch('Logout').then(() => {
            next({ path: '/user/loginFts', query: { redirect: to.fullPath } })
          })
        })
      } else {
        if (to.query.title) {
          to.meta.title = to.query.title
        }
        // 订单模块先初始化
        if( to.path.indexOf('order') !== -1){
          // console.log()
        }
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      NProgress.done()
      next()
    } else {
      next({ path: '/user/loginFts', query: { redirect: to.fullPath } })
      NProgress.done() 
    }
  }
})

router.afterEach(() => {
  NProgress.done() 
})
