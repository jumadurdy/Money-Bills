const routes = [
  {
  path: '/dashboard',
  component:() => import('layouts/MainLayout.vue'),
  meta: { requiresAuth: true },
  children:[
    {
      path:'',
      name:'Dashboard',
      component:()=> import('pages/PageEnteries.vue')
    },
    {
        path: 'settings',
        name: 'Settings',
        component: () => import('pages/PageSettings.vue')
        // URL '/settings' olduğunda, MainLayout içinde PageSettings.vue bileşenini yükle.
      }
  ],
// ===== EKLENEN SATIRLAR START =====
    // Meta - authenticate kontrolü (opsiyonel)
    // ===== EKLENEN SATIRLAR END =====

  },

  {

    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '',
        name:'Enteries',
        component: () => import('pages/PageEnteries.vue')
       },
       {
        path: 'settings',
        name: 'Settings',
        component: () => import('pages/PageSettings.vue')
        // URL '/settings' olduğunda, MainLayout içinde PageSettings.vue bileşenini yükle.
      },


    ],

  },

  {
    path: '/login',
    component: () => import('pages/LogoutPages.vue'),
    meta: { requiresAuth: false }
  },

  // ===== LOGOUT ROUTE BURAYA =====
  {
    path: '/logout',
    redirect: () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      return '/login'
    }
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

