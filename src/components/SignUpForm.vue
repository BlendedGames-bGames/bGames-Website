<template>
<div>
        
        <card-component title="" icon="" class="column is-two-thirds is-offset-2" >
                <hero-bar :has-right-visible="true" >
                            Registro
                </hero-bar>
                <form @submit.prevent>
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
import { mapMutations, mapActions, mapGetters } from 'vuex'
import firebase from 'firebase/compat/app'
import "firebase/compat/auth"
export default {
  name: 'SignUpForm',
  components: {
    CardComponent,
    HeroBar
  },
  data () {
    return {
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
        register: 'register',
        userCreatedAlreadyToggle: 'userCreatedAlreadyToggle'
    }),

    registerButton () {
      var email = this.form.email;
      var pass = this.form.password;
      firebase.auth().createUserWithEmailAndPassword(email, pass)
      .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
      })
      .then(function(){
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function() {
        // Email sent.
        }).catch(function(error) {
        // An error happened.
        });
      });
      
      
      setTimeout(() => {
        var message;
        console.log(this.userCreatedAlready)
        if(!this.userCreatedAlready){
          message = 'Se envio un mail a '+this.form.email+' para que se confirme el mail'
        }
        else{
          message = 'Un usuario con ese email ya existe, intente con otro email'
          this.userCreatedAlreadyToggle()
        }
        this.$buefy.snackbar.open(
          {
            message: message,
            queue: false
          },
          500
        )
        this.formReset()
      })
    },
    backToLogin(){
      this.loginToggle()
    },
    formReset(){
      this.form.email = ''
      this.form.password = ''
              this.isLoading = false

    }
    
     
  },
  computed: {
      ...mapGetters('user', {
          userCreatedAlready: 'userCreatedAlready'
    }),
  }
}
</script>
