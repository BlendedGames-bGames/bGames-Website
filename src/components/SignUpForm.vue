<template>
<div>
        
        <card-component title="" icon="" class="column is-two-thirds is-offset-2" >
                <hero-bar :has-right-visible="true" >
                            Registro
                </hero-bar>
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
                            <b-button size="is-medium" native-type="submit" type="is-link" @click="registerButton"
                                >Sign Up</b-button
                            >
                        </div>
                </form>
                <hr />
            
                <div class="columns is-flex is-flex-direction-row is-justify-content-center">
                        <a v-on:click="backToLogin">Ya tienes una cuenta? Autenticate!</a>
                </div>           
        </card-component>

</div>
  
</template>

<script>
import CardComponent from '@/components/CardComponent'
import HeroBar from './HeroBar'
import { mapMutations, mapActions } from 'vuex'
import firebase from 'firebase/app'
import "firebase/auth"
export default {
  name: 'SignUpForm',
  components: {
    CardComponent,
    HeroBar
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
    ...mapMutations([
        'loginToggle', 
    ]),
    ...mapActions('user', {
        register: 'register'
    }),

    submit () {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.$buefy.snackbar.open(
          {
            message: 'Usuario creado',
            queue: false
          },
          500
        )
      })
    },
    registerButton () {
      this.register({email:this.form.email, password: this.form.password})
    },
    backToLogin(){
      this.loginToggle()
    }
     
  }
}
</script>
