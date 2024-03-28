<template>
<div >
 <nav v-show="isNavBarVisible" id="navbar-main" class="navbar is-fixed-top">
    <div class="navbar-brand">
      <a
        class="navbar-item is-hidden-desktop"
        @click.prevent="menuToggleMobile"
      >
        <b-icon :icon="menuToggleMobileIcon" />
      </a>
    </div>
    <div class="navbar-brand is-right">
      <a
        class="navbar-item navbar-item-menu-toggle is-hidden-desktop"
        @click.prevent="menuNavBarToggle"
      >
        <b-icon :icon="menuNavBarToggleIcon" custom-size="default" />
      </a>
    </div>
    <div
      class="navbar-menu fadeIn animated faster"
      :class="{ 'is-active': isMenuNavBarActive }"
    >
      <div class="navbar-end" >
         <a
          class="navbar-item  "
          @click="toggleKey"
          :disabled="keyGenerationDisable"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-key" viewBox="0 0 16 16" style="margin-right: 6px;">
            <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5"/>
            <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
          </svg>
            Llave de autenticacion    
           <div v-if="!keyModal && !keyGenerationPressed && generatedKey" class="timer">{{ prettyTime | prettify }}</div>

        </a>
        <nav-bar-menu class="has-divider has-user-avatar">
          <user-avatar />
          <div class="is-user-name" style="margin-top: 3px;">
            <span>{{ userProfile.name }}</span>
          </div>

       
        </nav-bar-menu>
       
        <a
          class="navbar-item is-desktop-icon-only"
          title="Log out"
          @click="logoutButton"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16">
          <path d="M7.5 1v7h1V1z"/>
          <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/>
        </svg>
          <span>Log out</span>
        </a>
      </div>
    </div>
  </nav>

    <b-modal  v-model="keyModal"  :on-cancel="restTime" :width="450" scroll="keep">
        <form action="">
                  <div class="modal-card" style="width: auto">
                      <header class="modal-card-head">
                          <p class="modal-card-title">Peticion llave de autenticacion de aplicacion desktop </p>
                          <button
                              type="button"
                              class="delete"
                              @click="restTime"/>
                      </header>
                      <section class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center modal-card-body">
                        
                          <b-field label="Llave" >
                              <b-input
                                  :value="key"
                                  v-model="key"
                                  required>
                              </b-input>
                                 <b-button v-clipboard="() => key" type="is-info" v-clipboard:success="clipboardNotification"
                                   icon-right="clipboard-list" />
                          </b-field>
                           <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading>
                           <div v-if="generatedKey" style="text-align:center">
                             Tiempo de expiracion de la llave:
                               <Timer :time="time" @time-is-up="timeUp" @actual-time="actualTime"/>
                           </div>

                      </section>
                      <footer class="modal-card-foot">
                      </footer>
                  </div>
              </form>
    </b-modal>



</div>
 
</template>

<script>
import Axios from 'axios'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import NavBarMenu from '@/components/NavBarMenu'
import UserAvatar from '@/components/UserAvatar'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import {baseURL, sensorCommunicationPort,userPort} from '../store/urls'
import Timer from '@/components/Timer/mainTimer'

export default {
  name: 'NavBar',
  components: {
    UserAvatar,
    NavBarMenu,
    Timer
  },
  data () {
    return {
      isMenuNavBarActive: false,
      loggedIn: false,
      email:'leiser.mahu@usach.cl',
      provider: 'google.com',
      password:'',
      key:'',
      keyModal:false,
      generatedKey:false,
      isLoading:false,
      truer:true,
      sensorCommunicationHost:baseURL+sensorCommunicationPort,
      userHost:baseURL+userPort,
      time:120,
      timer:null,
      keyGenerationPressed:false,
      keyGenerationDisable:false
    }
  },
  filters: {
    prettify : function(value) {
      let data = value.split(':')
      let minutes = data[0]
      let secondes = data[1]
      if (minutes < 10) {
        minutes = "0"+minutes
      }
      if (secondes < 10) {
        secondes = "0"+secondes
      }
      return minutes+":"+secondes
    }
	},
  computed: {
    prettyTime () {
				let time = this.time / 60
				let minutes = parseInt(time)
				let secondes = Math.round((time - minutes) * 60)
				return minutes+":"+secondes
		},
    menuNavBarToggleIcon () {
      return this.isMenuNavBarActive ? 'close' : 'dots-vertical'
    },
    menuToggleMobileIcon () {
      return this.isAsideMobileExpanded ? 'backburger' : 'forwardburger'
    },
    ...mapGetters('user', {
          id_player: 'id_player'
    }),
    ...mapGetters('socket', {
        authenticationSocket: 'authenticationSocket'
    }),

    ...mapState(['isNavBarVisible', 'isAsideMobileExpanded', 'userName']),
    ...mapState('user', ['userProfile' ]    )
  },
  mounted () {
    this.$router.afterEach(() => {
      this.isMenuNavBarActive = false
    })
    this.checkAlreadyLoggedInDesktopApp()
    if(!this.authenticationSocket){
      console.log(this)
        this.setupAuthenticationSocket()
    }
    this.listen()
  },
  beforeCreate () {
    firebase.auth().onAuthStateChanged(user => {
        this.loggedIn = !!user;
    });
  },
  methods: {
     ...mapMutations([
        'isAuthenticatedToggle'
    ]), 
    
    ...mapActions('socket', {
        setupAuthenticationSocket: 'setupAuthenticationSocket',
        leaveRoomsSockets : 'leaveRoomsSockets'
    }),
    ...mapActions('user', {
        logout: 'logout'
    }),
    menuToggleMobile () {
      this.$store.commit('asideMobileStateToggle')
    },
    timeUp(){
      this.keyModal = false
      this.deleteKey()

    },
    restTime(){
      this.keyModal = false
      this.timer = setInterval( () => {
        console.log(this.time)
        if (this.time > 0) {
            this.time--
        } else {
          this.stopTimer()
        }
      }, 1000 )

    },
    stopTimer(){
      this.deleteKey()
    },
    
    async deleteKey(){
      clearInterval(this.timer)      
      const data = {
        key:null
      }
      const GET_KEY_URL = this.userHost+'/create_desktop_key/'+this.id_player 
      try {
            const reply = await Axios.post(GET_KEY_URL,data)
            this.$buefy.toast.open('Expiro su llave de autenticacion, generela nuevamente')
            this.time = 120
            this.generatedKey = false

      } catch (error) {
              this.$buefy.toast.open('Hubo un error en la activacion, intente nuevamente')

        }

    },
    toggleKeyModal(){
      this.keyModal = !this.keyModal
    },
    actualTime(time){
      this.time = time
      console.log(this.time)
    },
    async checkAlreadyLoggedInDesktopApp(){
        const GET_KEY_URL = this.sensorCommunicationHost+'/player_already_logged_desktop_app/'+this.id_player 
        try {
            const reply = await Axios.get(GET_KEY_URL)
            this.keyGenerationPressed = reply.data.message
            this.generatedKey = reply.data.message

        } catch (error) {
              this.$buefy.toast.open('Hubo un error en la confirmacion de si esta ya autenticado en la aplicacion de escritorio, intente nuevamente')
        }

    },
    clipboardNotification(){
        this.$buefy.toast.open('Texto copiado exitosamente')
    },
    async toggleKey(){
      console.log(this.keyModal)
      clearInterval(this.timer)      
      console.log(this.keyModal)
      if(!this.keyGenerationPressed){
         this.toggleKeyModal()
      }
      if(!this.generatedKey){
        console.log('paso por aqui')
        this.isLoading = true
        const GET_KEY_URL = this.sensorCommunicationHost+'/create_desktop_key/'+this.id_player 
        try {
            const reply = await Axios.get(GET_KEY_URL)
            this.key = JSON.parse(reply.data).key
            console.log(reply)
            console.log(reply.data)
            this.isLoading = false
            this.generatedKey = true


        } catch (error) {
              this.$buefy.toast.open('Hubo un error en la activacion, intente nuevamente')

        }
      }

    },
    listen: function () {		
      /*Input: attribute = {id_attributes: [], data: []}, ids de dimensiones y los datos nuevos actualizados desde el post att microservicio*/
      this.authenticationSocket.on('confirmUser', message => {
        console.log('aqui')
        console.log(message)
         this.$buefy.dialog.confirm({
          title: 'Confirmacion de autenticacion login en aplicacion de escritorio',
          message: message,
          confirmText: 'Si',
          type: 'is-warning',
          hasIcon: true,
          onCancel: () => {
          } ,
          onConfirm: () => {
            clearInterval(this.timer)      
            this.authenticationSocket.emit('userConfirmed', this.id_player.toString())

           
          } 
        })
      });
      this.authenticationSocket.on('keyUsed', message => {
        console.log('aqui')
        this.keyModal = false
        clearInterval(this.timer)  
        this.time = 120    
        this.keyGenerationPressed = true
        this.keyGenerationDisable = true
        this.$buefy.toast.open('Ingreso a la aplicacion de escritorio exitosa')

      });
      this.authenticationSocket.on('logout', message => {
        this.generatedKey = false
        this.keyGenerationPressed = false
        this.keyGenerationDisable = false
        clearInterval(this.timer)  
        this.$buefy.toast.open('Se ha salido de su cuenta desde la aplicacion de escritorio exitosamente')

      });
		},
    async toggleConfirmationKey(){

      const data ={
        "email": this.email,
        "password":this.password,
        "key":this.key,
        "provider": this.provider
      }
      console.log(data)
      const GET_CONFIRMATION_URL = this.sensorCommunicationHost+'/desktop_authentication_key'
        try {
            const reply = await Axios.post(GET_CONFIRMATION_URL,data)
            console.log(reply)
            console.log(reply.data)


        } catch (error) {
              this.$buefy.toast.open('Hubo un error en la activacion, intente nuevamente')

        }
    },
    menuNavBarToggle () {
      this.isMenuNavBarActive = !this.isMenuNavBarActive
    },
    async logoutButton () {
      //this.authenticationSocket.emit('leaveRoom', this.id_player.toString())
      this.leaveRoomsSockets()
      this.logout()
      this.$buefy.snackbar.open({
        message: 'Logging out',
        queue: false
      })
    }
  }
}
</script>
