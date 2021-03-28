<template>
  <div >
    <div  v-if="loggedIn && dataReady" class="main-view has-aside-left has-aside-mobile-transition has-navbar-fixed-top has-aside-expanded">
        <nav-bar />
        <aside-menu :menu="menu" />
             <div class="main-body">
                <router-view />
                <footer-bar />
            </div>
    </div>
    <div v-else>
        <router-view />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapActions } from 'vuex'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import FooterBar from '@/components/FooterBar'

export default {
  name: 'Home',
  components: {
    FooterBar,
    AsideMenu,
    NavBar
  },
  data () {
    return {
      isLoading: false
     
    }
  },
  
  computed: {
      ...mapGetters('user', {
          loggedIn: 'loggedIn',
          dataReady: 'dataReady',
          menu:'menu'
    })
  }
}
</script>
