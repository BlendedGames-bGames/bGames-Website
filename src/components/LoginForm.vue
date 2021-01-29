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
                            <b-button size="is-medium" native-type="submit" type="is-link" @click="login"
                                >Login</b-button
                            >
                        </div>
                </form>
                <hr />
                <div >
                        <b-button size="is-large" type="is-danger"
                            icon-left="google"  style="margin-bottom:1em" expanded> 
                            Login con Google
                        </b-button>
                        <b-button size="is-large"  type="is-info" expanded
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
                                icon-left="account"   v-on:click="register">
                                Sign up
                            
                    </b-button>

                </div>                 
        </card-component>
        
        
</template>

<script>
import CardComponent from '@/components/CardComponent'
import { mapMutations } from 'vuex'
import firebase from 'firebase/app'
import "firebase/auth"
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
  methods: {
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
    async login(){
      try {
            console.log(this.form.email,this.form.password)
            const val = firebase.auth().signInWithEmailAndPassword(this.form.email,this.form.password)
            console.log(val)
            this.isAuthenticatedToggle()
            this.$router.replace({name:'dashboard'})

      } catch (error) {
        console.log(error)
      }
    },
    register () {
      this.loginToggle()
    },
     ...mapMutations([
        'loginToggle', 
        'isAuthenticatedToggle'
    ]),
  }
}
</script>
