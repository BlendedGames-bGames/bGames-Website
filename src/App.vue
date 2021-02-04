<template>
  <div >
    <div  v-if="loggedIn && dataReady" class="main-view has-aside-left has-aside-mobile-transition has-navbar-fixed-top has-aside-expanded">
        <nav-bar />
        <aside-menu :menu="menu" />
             <div class="main-body">

                <router-view />
            </div>


        <footer-bar />

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
      isLoading: false,
      menu:[
         'Dashboard',
        [
          {
            to: '/statistics',
            icon: 'desktop-mac',
            label: 'Estadisticas generales'
          }
        ],
        'Contribuciones',
        [         
          {
            to: '/dimensions_sensors',
            icon: 'desktop-mac',
            label: 'Dimensiones'
          },
           {
            to: '/sensors_dimensions',
            icon: 'desktop-mac',
            label: 'Sensores y Puntos de datos'
          }
        ],
        'Administracion',
        [
          {
            to: '/data_points',
            label: 'Puntos de datos',
            icon: 'table',
          },
          {
            to: '/sensor_asociation',
            label: 'Asociacion a sensores',
            icon: 'square-edit-outline'
          }
        ]
      ]
      /*menu:[
        'Estadisticas',
        [
          {
            to: '/dashboard',
            icon: 'desktop-mac',
            label: 'Dimensiones'
          },
          {
            to: '/dashboard',
            icon: 'desktop-mac',
            label: 'Sensores'
          }
        ],
        'Configuracion',
        [
          {
            to: '/tables',
            label: 'Administracion sensores',
            icon: 'table',
          },
          {
            to: '/forms',
            label: 'Asociacion de sensores',
            icon: 'square-edit-outline'
          }
        ],
        'About',
        [
          {
            href: 'https://admin-one.justboil.me',
            label: 'Premium Demo',
            icon: 'credit-card'
          },
          {
            href: 'https://justboil.me/bulma-admin-template/one',
            label: 'About',
            icon: 'help-circle'
          }
        ]
      ]*/
    }
  },
  
  computed: {
      ...mapGetters('user', {
          loggedIn: 'loggedIn',
          dataReady: 'dataReady'
    })
  }
}
</script>
