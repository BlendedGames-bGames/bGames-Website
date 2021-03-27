import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'


import Login from '../views/Login.vue'
import Statistics from '../views/Statistics.vue'
import SensorContribution from '../views/SensorContribution.vue'
import DimensionContribution from '../views/DimensionContribution.vue'
import DataEndpoint from '../views/DataEndpoint.vue'
import SensorAsociation from '../views/SensorAsociation.vue'
import TimeSeries from '../views/TimeSeries.vue'
import PrivacyPolicy from '../views/PrivacyPolicy.vue'
import DeleteUserDataTemplate from '../views/DeleteUserDataTemplate.vue'

import firebase from 'firebase/app'
import store from '../store/index'

import "firebase/auth"
Vue.use(VueRouter)

const routes = [
  {
    
    path: '/',
    beforeEnter: (to, from, next) => {
      // ...
      console.log(window.localStorage.getItem('route'))
      let route = window.localStorage.getItem('route')
      if(route){
        next(route)
      }
      else{
        next('/login')
      }

    }
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
      title: 'Estadisticas en el tiempo',
      requiresAuth: true

    },
    path: '/time_statistics',
    name: 'time_statistics',
    component: TimeSeries
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Contribuidores a dimensiones',
      requiresAuth: true

    },
    path: '/dimensions_sensors',
    name: 'dimensions_sensors',
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
    name: 'sensors_dimensions',
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
    name: 'data_points',
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
    name: 'sensor_asociation',
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
  },
  
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Politicas de privacidad',
      requiresAuth: false

    },
    path: '/privacy_policy',
    name: 'privacy_policy',
    component: PrivacyPolicy
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Eliminación de datos de usuario',
      requiresAuth: false

    },
    path: '/delete_user_data',
    name: 'delete_user_data',
    component: DeleteUserDataTemplate
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
  let currentUser = window.localStorage.getItem('user')
  console.log(requiresAuth)
  console.log(currentUser)
  console.log(currentUser === 'null')

  if (requiresAuth && currentUser === 'null') {
    next( '/' )
  }
  else{
    next()
  }
})
  
export default router
