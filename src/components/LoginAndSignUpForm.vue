<template>
    <div >
        <login-form v-if="loginForm"/>
        <sign-up-form v-else/>    
        <div class="is-flex is-justify-content-space-between">
        
            <router-link to="/privacy_policy">
                        <b> Politicas de privacidad</b>  
              </router-link>     
          
             <router-link to="/delete_user_data">
                        <b> Borrar datos de usuario</b>  
              </router-link>     
          
        </div>   
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
