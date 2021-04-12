<template>
  <div>
    
          <b-modal v-model="confirmEmailBool" :width="640"  scroll="clip" >
                  <div class="card"  >
                      <header class="modal-card-head">
                          <p class="modal-card-title">Confirmacion de email de usuario</p>
                          <button
                              type="button"
                              class="delete"
                              @click="!confirmEmailBool"/>
                      </header>
                      <div class="card-content"  >
                            <p>{{modalMessage}}
                            </p> 
                            <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading>
                      </div>
                      <footer class="modal-card-foot is-flex is-flex-direction-row is-justify-content-space-between">
                                             
                            
                      </footer>
                  </div>

            </b-modal>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import LoginAndSignUpForm from '../components/LoginAndSignUpForm.vue'
import { mapGetters,mapActions } from 'vuex'
import router from '../router/index';
import firebase from '@/firebase';

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
        email: null,
        password: null,
      },
      confirmEmailBool:false,
      modalMessage:''
    }
  },
  async created(){
    
    window.localStorage.setItem('route','/confirmEmail/:email/:password' )
    this.isLoading = true
    this.confirmEmailBool = true
    console.log(this.$route.params)
    this.form.email = this.$route.params.email
    this.form.password = this.$route.params.password
    firebase
    .auth()
    .fetchSignInMethodsForEmail(this.form.email)
    .then((result) => {
      console.log('result', result);

      if(result.length === 0){
        //Usuario VALIDO y nuevo
        this.callCreateEmailPassUser()
        
      }
      else{
        this.isLoading = false
        this.modalMessage = "El link ha expirado debido a que este usuario ya existe"
        setInterval(() => {
          this.confirmEmailBool = false
          router.push({path:'/login'})
        }, 1000);
      }
    });
   
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
    ...mapActions('user',[
        'createEmailPassUser'
    ]),
    async callCreateEmailPassUser(){
        await this.createEmailPassUser({email:this.form.email, password:this.form.password})
        this.isLoading = false
        this.modalMessage = "Usuario "+this.form.email+" ha sido confirmado!"
        setInterval(() => {
          this.confirmEmailBool = false
          router.push({path:'/login'})
        }, 1000);
    }
  }
}
</script>
