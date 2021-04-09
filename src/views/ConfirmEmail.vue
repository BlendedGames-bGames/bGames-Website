<template>
  <div>
    <b-message v-if="!isLoading" title="Default" aria-close-label="Close message">
        Usuario {{form.email}} ha sido confirmado!
    </b-message>
    <b-loading :is-full-page="isFullPage" v-model="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import LoginAndSignUpForm from '../components/LoginAndSignUpForm.vue'
import { mapGetters,mapActions } from 'vuex'

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
      }
    }
  },
  async created(){
    this.isLoading = true
    console.log(this.$route.params)
    this.form.email = this.$route.params.email
    this.form.password = this.$route.params.password
    await this.callCreateEmailPassUser()
    this.isLoading = false
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
    }
  }
}
</script>
