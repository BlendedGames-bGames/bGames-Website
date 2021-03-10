<template>
  <div class="columns">
    <div class="column">
        <img style="width: 100wh; height: 100vh" src="https://i.imgur.com/A3tzP69.jpg" alt="JustBoil.me" />
    </div>
    <div class="column" style="height:100vh">
      <div class="card" style=" border-radius: none; border: none;">
     
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
import { mapGetters } from 'vuex'

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
      isFullPage:true
    }
  },
  mounted(){
    window.localStorage.setItem('route','/login' )
  },
  computed: {
    titleStack () {
      return ['Admin', 'Tables']
    },
    ...mapGetters('user',{
        loadingLoginData:'loadingLoginData'
    })
  },
  methods: {
    clicked (e) {
      console.log("I've been clicked")
    }
  }
}
</script>
