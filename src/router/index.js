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
import ConfirmEmail from '../views/ConfirmEmail.vue'


import SensorCRUD from '../views_developers/SensorCRUD.vue'
import EndpointCRUD from '../views_developers/EndpointCRUD.vue'
import ConversionCRUD from '../views_developers/ConversionCRUD.vue'

import DimensionCRUD from '../views_developers/DimensionCRUD.vue'
import AttributeCRUD from '../views_developers/AttributeCRUD.vue'



import firebase from 'firebase/app'
import store from '../store/index'

import "firebase/auth"
Vue.use(VueRouter)

const routes = [
  {
    
    path: '/',
    beforeEnter: (to, from, next) => {
      // ...
      console.log("vengo de ",from)
      console.log("voy a ", to)
      console.log('tengo lo siguiente en la ruta: ')
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
      title: 'confirmEmail',
      requiresAuth: false

    },
    path: '/confirmEmail/:email/:password',
    props:true,
    name: 'confirmEmail',
    component: ConfirmEmail
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
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'CRUD de sensores',
      requiresAuth: true

    },
    path: '/sensor_crud',
    name: 'sensor_crud',
    component: SensorCRUD
  },

  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'CRUD de endpoints',
      requiresAuth: true

    },
    path: '/endpoint_crud',
    name: 'endpoint_crud',
    component: EndpointCRUD
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'CRUD de conversiones',
      requiresAuth: true

    },
    path: '/conversion_crud',
    name: 'conversion_crud',
    component: ConversionCRUD
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'CRUD de dimensiones',
      requiresAuth: true

    },
    path: '/dimension_crud',
    name: 'dimension_crud',
    component: DimensionCRUD
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'CRUD de atributos',
      requiresAuth: true

    },
    path: '/attribute_crud',
    name: 'attribute_crud',
    component: AttributeCRUD
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
