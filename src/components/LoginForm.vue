<template>
    <card-component title="" icon="" class="column is-two-thirds is-offset-2" >
            <form @submit.prevent="submit">
                    <b-field   horizontal
                            label="Email" style="margin-bottom: 2em"
                    >
                    <b-field>
                        <b-input
                        v-model="form.email"
                        icon="account"
                        placeholder="email"
                        name="email"
                        required
                        />
                    </b-field>
                
                    </b-field>
                    <b-field  horizontal
                            label="Password"
                    >
                        <b-input
                        v-model="form.password"
                        icon="lock"
                        type="password"
                        placeholder="Password"
                        name="password"
                        required
                        />
                    </b-field>
                    <hr />
                    <div class="control is-flex is-flex-direction-row is-justify-content-center">
                        <b-button size="is-medium" native-type="submit" type="is-link" @click="login('EmailAndPass')">
                          Login
                        </b-button>
                    </div>
            </form>
            <hr />
            <div >
                    <b-button size="is-large" type="is-danger" @click="login('Google')"
                        icon-left="google"  style="margin-bottom:1em" expanded> 
                        Login con Google
                    </b-button>
                    <b-button size="is-large"  type="is-info" expanded @click="login('Facebook')"
                        icon-left="facebook" >
                        Login con Facebook
                    </b-button>

            </div>
            <hr/>
            <div class="columns is-flex is-flex-direction-row is-justify-content-center">
                    <h1>Eres nuevo? Create una cuenta!</h1>
                    

            </div>
            <div class="columns is-flex is-flex-direction-row is-justify-content-center">

                <b-button size="is-medium"  
                            icon-left="account"   v-on:click="registerToggle">
                            Sign up
                        
                </b-button>

            </div>                 
    </card-component>
    
        
</template>

<script>
import CardComponent from '@/components/CardComponent'
import { mapMutations, mapActions,mapGetters } from 'vuex'
export default {
  name: 'LoginForm',
  components: {
    CardComponent
  },
  data () {
    return {
      isLoading: false,
      form: {
        email: null,
        password: null
      }
    }
  },
  computed:{
    ...mapGetters('user',{
      loggedIn: 'loggedIn',
      typeLogin: 'typeLogin'
    })
  },
  methods: {
    ...mapMutations([
        'loginToggle', 
        
    ]),
    ...mapActions('user', {
        loginProvider: 'loginProvider',
        loginEmailAndPassword: 'loginEmailAndPassword'
    }),

    submit () {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.$buefy.snackbar.open(
          {
            message: 'Updated',
            queue: false
          },
          500
        )
      })
    },
    registerToggle () {
      this.loginToggle()
    },
    async login(provider){
      if(provider !== 'EmailAndPass'){
          this.loginProvider({provider:provider})
      }
      else{
          this.loginEmailAndPassword({email:this.form.email, password: this.form.password})
      }
      
      console.log(this.loggedIn)
     
      
    }
     
  }
}
</script>
