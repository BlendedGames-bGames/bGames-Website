<template>
  <div class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <hero-bar>Delete user's data instructions</hero-bar>
      <card-component title="Delete steps" icon="ballot" >
        <p>To delete user data from the Blended Games application you must first of all,
           log in with your account to ensure identity</p>
                    
          <login-form typeLogin/>

          <div style="padding-top:1em"></div>
          <p>Identity data:</p>
          <p>Name: {{userProfile.name}} </p>
          <p>Email: {{userProfile.email}} </p>
          <p>provider: {{userProfile.providerId}} </p>
          <p>Unique id: {{userProfile.uid}}</p>
          <div style="padding-top:1em"></div>

          <strong>Write an email to the address: leiser.mahu@gmail.com with the previous data with the subject: "Deletion of user data" to be able to delete
            your user data
          </strong>

      </card-component >


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CardComponent from '@/components/CardComponent'
import LoginForm from '@/components/LoginForm'
import HeroBar from '@/components/HeroBar'

export default {
  name: 'DeleteUserDataTemplate',
  
  components: {
    LoginForm,
    CardComponent,
    HeroBar
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
  watch: {
    notAnAdmin(newValue, oldValue) {
      console.log(newValue,oldValue)
      if(newValue){
        this.$buefy.notification.open({
            message: 'Esta cuenta no tiene los permisos de administrador y/o desarrollador, porfavor contactar al administrador para entrar al portal',
            type: 'is-danger',
            hasIcon: true
        })
        
      }
     
    },
  },
  mounted(){
    window.localStorage.setItem('route','/login' )
  },
  computed: {
    titleStack () {
      return ['Admin', 'Tables']
    },
    ...mapGetters('user',{
        loadingLoginData:'loadingLoginData',
        notAnAdmin: 'notAnAdmin',
        userProfile: 'userProfile'
    })
  },
  methods: {
    clicked (e) {
      console.log("I've been clicked")
    }
  }
}
</script>
