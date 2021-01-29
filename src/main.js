/* Styles */
import '@/scss/main.scss'

/* Core */
import Vue from 'vue'
import Buefy from 'buefy'
import axios from 'axios'

/*Firebase */
import firebase from 'firebase/app'

 // Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAm38vm2k27gMXPSLjH_PNQ-8QoHsxjWng",
  authDomain: "blended-games-cc73b.firebaseapp.com",
  projectId: "blended-games-cc73b",
  storageBucket: "blended-games-cc73b.appspot.com",
  messagingSenderId: "681561900800",
  appId: "1:681561900800:web:caf3e8fe64b7759fd6d5e5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


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


/*Fix debido a que currentUser() se carga mas lento asi que se chequea firebase ANTES de cargar la app
  (pasa cuando uno refresca la pagina por ej)
*/

let app;
firebase.auth().onAuthStateChanged(user =>{
  console.log(user)
  if(!app){
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
    
  }
})

