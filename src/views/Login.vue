<template>
  <div class="columns">
    <div class="column">
        <img style="width: 100wh; height: 100vh" src="https://i.imgur.com/A3tzP69.jpg" alt="JustBoil.me" />
    </div>
    <div class="column" style="height:100vh">
   
      <div class="card" style=" border-radius: none; border: none;">
        <div class="is-flex is-justify-content-flex-end">
              <b-field>
                <b-switch
                    v-model="developerTick"
                    passive-type='is-dark'
                    type='is-warning'
                     @input="menuType">
                    {{ developerTick ? "Desarrollador" : "Jugador" }}
                </b-switch>
            </b-field>

          
        </div>
        <div class="card-content is-flex is-flex-direction-column		is-justify-content-center	is-align-items-space-evenly	is-align-content-center"  style="height:100vh">
             <hero-bar :has-right-visible="false" class="column is-two-thirds is-offset-3">
                Blended Games Framework
              </hero-bar>
              <login-and-sign-up-form/>       
       </div>

     </div>

    </div>
    <b-loading :is-full-page="isFullPage" v-model="loadingLoginData" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import LoginAndSignUpForm from '../components/LoginAndSignUpForm.vue'
import { mapGetters,mapMutations } from 'vuex'

export default {
  name: 'Login',
  components: {
    CardComponent,
    HeroBar,
    LoginAndSignUpForm
  },
  data () {
    return {
      isLoading: false,
      form: {
        username: null,
        password: null,
      },
      isFullPage:true,
      developerTick: false
    }
  },
    watch: {
    notAnAdmin(newValue, oldValue) {
      console.log(newValue,oldValue)
      if(newValue){
        this.$buefy.notification.open({
            message: 'Esta cuenta no tiene los permisos de administrador y/o desarrollador, porfavor contactar al administrador para entrar al portal',
            type: 'is-danger',
            hasIcon: true
        })
        this.TOGGLE_NOT_AN_ADMIN()        
      }
     
    },
  },
  mounted(){
    window.localStorage.setItem('route','/login' )
    console.log(this.$route)
    if(this.loadingLoginData){
      this.TOGGLE_LOADING_LOGIN_DATA()
    }
  },
  computed: {
    titleStack () {
      return ['Admin', 'Tables']
    },
    ...mapGetters('user',{
        loadingLoginData:'loadingLoginData',
        notAnAdmin: 'notAnAdmin'
    })
  },
  methods: {
    clicked (e) {
      console.log("I've been clicked")
    },
    ...mapMutations('user',[
        'TOGGLE_NOT_AN_ADMIN', 
        'TOGGLE_MENU_ADMIN',
        'TOGGLE_MENU_PLAYER',
        'TOGGLE_LOADING_LOGIN_DATA'
        
    ]),
    menuType(){
      if(this.developerTick){
        this.TOGGLE_MENU_ADMIN()
      }
      else{
        this.TOGGLE_MENU_PLAYER()
      }
    }
  }
}
</script>
