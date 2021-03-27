<template>
    <div >
        <login-form v-if="loginForm"/>
        <sign-up-form v-else/>       
        
            <router-link to="/privacy_policy">
                        <b> Politicas de privacidad</b>  
              </router-link>     
    </div>
        
</template>

<script>
import CardComponent from '@/components/CardComponent'
import LoginForm from '@/components/LoginForm'
import SignUpForm from './SignUpForm.vue'
import { mapState } from 'vuex'

export default {
  name: 'LoginAndSignUpForm',
  components: {
    CardComponent,
    LoginForm,
    SignUpForm
    
  },
  data () {
    return { }
      
  },
   computed: {
     ...mapState({
          loginForm: 'loginForm'
     })
  }
}
</script>
