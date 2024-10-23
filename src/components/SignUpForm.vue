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

    registerButton() {
      var email = this.form.email;
      var pass = this.form.password;
      
      firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(userCredential => {
          fetch('http://localhost:3010/player', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email,
              password: pass, // Asegúrate de hashear la contraseña en tu backend antes de guardarla en la base de datos
              name: "user",
              age: 25,
              external_type: "none",
              external_id: "none"
            })
          })
          .then(response => response.json())
          .then(data => {
            // Manejar la respuesta del servidor si es necesario
            console.log('Usuario guardado en la base de datos SQL local:', data);
            return this.addAttributesToNewUser(email);
          })
          .catch((error) => {
            console.error('Error al guardar el usuario en la base de datos SQL local:', error);
          });

          // Mostrar mensaje de éxito
          this.$buefy.snackbar.open({
            message: 'Usuario registrado exitosamente',
            queue: false
          });

          this.formReset();
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
        });
    },
    addAttributesToNewUser(email){
      fetch('http://localhost:3010/player_by_email/'+email)
      .then(response => response.json())
      .then(data => {
        // Manejar la respuesta del servidor para el GET
        console.log('Datos obtenidos con el GET:', data);
        var id = data.id_players;
        fetch('http://localhost:3002/player_all_attributes/'+id, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          // Manejar la respuesta del servidor
          console.log('Datos obtenidos:', data);
        })
        .catch((error) => {
          console.error('Error en la solicitud POST:', error);
        });
      })
      .catch((error) => {
        console.error('Error al obtener los datos con el GET:', error);
      });
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
