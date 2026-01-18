import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })
  // ===== YENİ EKLE: ROUTER GUARD =====
  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('accessToken')
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

     console.log('🔍 Route:', to.path)
  console.log('🔍 Token:', token ? 'VAR' : 'YOK')
  console.log('🔍 RequiresAuth:', requiresAuth)
 if (to.path === '/logout') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    console.log ('Tokenlar silindi - Login sayfasına yönlendir')
    next('/login')
    return
  }

    if (requiresAuth && !token) {
      // Token yok ve protected route → login'e yönlendir
      console.log('🔴 Login sayfasına yönlendiriliyor...')
      next('/login')
    } else if (token && to.path === '/login') {
      // Token var ve login'e gitmeye çalışıyorsa → dashboard'a yönlendir
       console.log('🟢 Dashboard sayfasına yönlendiriliyor...')
      next('/dashboard')
    } else if (!token && to.path === '/login') {
    // Token yok ve login sayfasına gidiyor - izin ver
    next()
    } else {
      // Diğer durumlar → normal devam et
      console.log('⚪ Normal devam et')
      next()
    }
  })
  // ===== GUARD SONU =====

  return Router
})
