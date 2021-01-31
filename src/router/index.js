import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import firebase from 'firebase/app'
import store from '../store/index'

import "firebase/auth"
Vue.use(VueRouter)

const routes = [
  {
    
    path: '/',
    redirect: {name:'login'}
  },

  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Login',
      requiresAuth: false

    },
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard',
      requiresAuth: true

    },
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    meta: {
      title: 'Tables',
      requiresAuth: true

    },
    path: '/tables',
    name: 'tables',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tables" */ '../views/Tables.vue')
  },
  {
    meta: {
      title: 'Forms',
      requiresAuth: true
    },
    path: '/forms',
    name: 'forms',
    component: () => import(/* webpackChunkName: "forms" */ '../views/Forms.vue')
  },
  {
    meta: {
      title: 'Profile',
      requiresAuth: true

    },
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue')
  },
  {
    meta: {
      title: 'New Client',
      requiresAuth: true

    },
    path: '/client/new',
    name: 'client.new',
    component: () => import(/* webpackChunkName: "client-form" */ '../views/ClientForm.vue')
  },
  {
    meta: {
      title: 'Edit Client',
      requiresAuth: true

    },
    path: '/client/:id',
    name: 'client.edit',
    component: () => import(/* webpackChunkName: "client-form" */ '../views/ClientForm.vue'),
    props: true
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = firebase.auth().currentUser
  console.log(requiresAuth, isAuthenticated)
  console.log(!isAuthenticated)
  console.log(to)
  window.localStorage.setItem('previousAuthentication',isAuthenticated)
  window.localStorage.setItem('previousRoute',to.fullPath)

  if (requiresAuth && !isAuthenticated && isAuthenticated !== null) {
    next( '/login' )
  }
  else{
  
    next()
  }
})
  
export default router
