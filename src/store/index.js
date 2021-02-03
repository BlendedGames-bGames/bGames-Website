import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/user'
import sensor from '@/store/sensor'
import attribute from '@/store/attribute'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    sensor,
    attribute
  },
  state: {
    /* User */
    userCred: false,
    userName: null,
    userEmail: null,
    userAvatar: null,
    isAuthenticated: false,


    /* NavBar */
    isNavBarVisible: true,

    /* FooterBar */
    isFooterBarVisible: true,

    /* Aside */
    isAsideVisible: true,
    isAsideMobileExpanded: false,

    /* */
    loginForm:true
  },
  getters:{

  },
  mutations: {
    /* A fit-them-all commit */
    basic (state, payload) {
      state[payload.key] = payload.value
    },
    loginToggle (state) {
      state.loginForm = !state.loginForm
    },
    /* User */
    user (state, payload) {
      if (payload.name) {
        state.userName = payload.name
      }
      if (payload.email) {
        state.userEmail = payload.email
      }
      if (payload.avatar) {
        state.userAvatar = payload.avatar
      }
      
    },
    isAuthenticatedToggle(state){
   
        state.isAuthenticated = !state.isAuthenticated
        window.localStorage.setItem('loggedIn', state.isAuthenticated)      
      
    },
    /* Aside Mobile */
    asideMobileStateToggle (state, payload = null) {
      const htmlClassName = 'has-aside-mobile-expanded'

      let isShow

      if (payload !== null) {
        isShow = payload
      } else {
        isShow = !state.isAsideMobileExpanded
      }

      if (isShow) {
        document.documentElement.classList.add(htmlClassName)
      } else {
        document.documentElement.classList.remove(htmlClassName)
      }

      state.isAsideMobileExpanded = isShow
    }
  },
  actions: {
    hasPermission(context) {
      if(context.state('userCred')) return true
      else return false
    }
  }
})
