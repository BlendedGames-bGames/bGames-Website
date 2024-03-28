/* Styles */
import '@/scss/main.scss'

/* Core */
import Vue from 'vue'
import Buefy from 'buefy'
import axios from 'axios'
import Clipboard from 'v-clipboard'
/* Firebase */
import './auth'

/* ApexCharts (Treemap) */
import VueApexCharts from 'vue-apexcharts'

/* Router & Store */
import router from './router'
import store from './store'

/* Vue. Main component */
import App from './App.vue'

Vue.use(Clipboard)

/* Default title tag */
const defaultDocumentTitle = 'Blended Games'

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

Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
