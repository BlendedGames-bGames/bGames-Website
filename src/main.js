/* Styles */
import '@/scss/main.scss'

/* Core */
import Vue from 'vue'
import Buefy from 'buefy'
import axios from 'axios'

/*Firebase */
import './auth'

import firebase from 'firebase/app'




/* Router & Store */
import router from './router'
import store from './store'

/* Vue. Main component */
import App from './App.vue'

/* Default title tag */
const defaultDocumentTitle = 'Admin One Bulma'

/* Collapse mobile aside menu on route change & set document title from route meta */
router.afterEach(to => {
  store.commit('asideMobileStateToggle', false)

  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }
})
Vue.prototype.$axios = axios

Vue.config.productionTip = true

Vue.use(Buefy)



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
    
