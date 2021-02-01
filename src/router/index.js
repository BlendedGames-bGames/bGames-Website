import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'


import Login from '../views/Login.vue'
import Statistics from '../views/Statistics.vue'
import SensorContribution from '../views/SensorContribution.vue'
import DimensionContribution from '../views/DimensionContribution.vue'
import DataEndpoint from '../views/DataEndpoint.vue'
import SensorAsociation from '../views/SensorAsociation.vue'

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
      title: 'Estadisticas Generales',
      requiresAuth: true

    },
    path: '/statistics',
    name: 'statistics',
    component: Statistics
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Contribuidores a dimensiones',
      requiresAuth: true

    },
    path: '/dimensions_sensors',
    name: 'dashboard',
    component: DimensionContribution
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Contribucion de sensores',
      requiresAuth: true

    },
    path: '/sensors_dimensions',
    name: 'dashboard',
    component: SensorContribution
  },  
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Puntos de datos',
      requiresAuth: true

    },
    path: '/data_points',
    name: 'dashboard',
    component: DataEndpoint
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Asociacion a sensores',
      requiresAuth: true

    },
    path: '/sensor_asociation',
    name: 'dashboard',
    component: SensorAsociation
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
