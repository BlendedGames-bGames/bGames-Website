<template>
  <div>
    <hero-bar>
      Asociacion a sensores basados en la web
    </hero-bar>
    <section class="section is-main-section">
      <card-component title="Forms" icon="ballot">
          <tiles>
              <card-widget  
                v-for="(sensor, index) in sensorTemplates"
                :key="index"
                class="tile is-child"
                type="is-primary"
                icon="account-multiple"
                :id="sensor.id_online_sensor"
                :image="sensor.image"
                :description="sensor.description"
                :label="sensor.name"
                :associate="sensor.associated"
                @handle-associate-action="association"
                />
            
          </tiles>
      </card-component>
      <instructions-modal   v-if="modalBool" :sensorName="selectedSensor.name" @associate-hide-click="hideClick" @associate-verification-click="associationClicked"> 
          <div class="instructions" v-if="selectedSensor.name === 'Trello'" >
                <p>
                  Primero que todo, debe estar <b>autenticado</b> con anterioridad en <a href="https://trello.com/home"></a>
                  para poder asociar su cuenta de Trello con Blended Games
                </p> 
                 <p>
                  1) Ingrese su username en Trello:
                </p>
                <b-field >
                              <b-input
                                  v-model="trelloUsername"
                                  placeholder="Ingrese username"                                  
                                  required>
                              </b-input>
                </b-field>
                <div v-if='trelloUsername.length !== 0'>
                    <p>
                        2) Entre a la siguiente direccion:
                    </p> 
                    <div >
                      <a target="_blank" href="https://trello.com/app-key">https://trello.com/app-key</a>
                    </div>
                    <p>
                      Deberia presentarse una pagina parecida a esta
                    </p> 
                    <div>
                      <img src="https://i.imgur.com/6QqI6iJ.png" alt="">
                    </div>  
                    <p>
                      Ingrese el numero de serie 'Llave':
                    </p>

                    <b-field >
                          <b-input
                              v-model="trelloKey"
                              placeholder="Ingresa la llave encontrada en la pagina"                                  
                              required>
                          </b-input>
                    </b-field>
                    <div v-if="trelloKey.length !== 0">
                      <p>
                        3) Genere su Token personal siguiendo el link subrayado <a href="token.com">token</a> del paso anterior
                      </p>
                      <p>
                          Deberia presentarse un recuadro que detalla que permisos son los que esta otorgando a Blended Games respecto a su cuenta en Trello:
                        </p> 
                      <div class="is-flex is-justify-content-center">
                        <img src="https://i.imgur.com/cZVqKJf.png" alt="">
                      </div> 
                      <p>
                            Permita los permisos presionando el boton 
                            <b-button
                            type="is-info" 
                            >
                              Permitir
                            </b-button>
                            que esta al final de la pagina
                        </p> 
                        <p>
                          4) Luego deberia presentarse un recuadro parecido a este en donde esta su token :
                        </p> 
                        <div>
                          <img src="https://i.imgur.com/p4mmqyQ.png" alt="">
                      </div>  
                        <p>
                          Ingrese el numero de serie del <a href="token">token</a>
                        </p>

                        <b-field>
                                      <b-input
                                          v-model="trelloToken"
                                          placeholder="Ingresa el token encontrado en la pagina"                                  
                                          required>
                                      </b-input>
                        </b-field>
                          <p>
                          5) Cuando este listo, presione el boton  <b-button
                            type="is-info" 
                            >
                              Asociar
                            </b-button> abajo a la derecha
                        </p>
                    </div>

                </div>
                
              
          </div>
          <div  class="instructions" v-else-if="selectedSensor.name === 'Chess.com'">
                <p>
                  Debido a que la fuente de informacion de Chess.com es publica, no se puede determinar la autenticacion de usuarios por lo
                  que se determinara su autentidad al <b>conectarse o desconectarse</b> de su cuenta de <a href="chess.com">chess.com</a> y
                  <b>esperar 5 minutos desde que realiza esta accion</b> para validar que es su cuenta
                </p> 
                 <p>
                  1) Ingrese su username en chess.com:
                </p>
                <b-field >
                              <b-input
                                  v-model="chessUserName"
                                  placeholder="Ingrese username" 
                                  :disabled="startTimer"                                 
                                  required>
                              </b-input>
                </b-field>
                 <p>
                  2) Cuando se <b>conecte o desconecte</b> de su cuenta de <a href="chess.com">chess.com</a> (puede ser cualquiera de las 2)
                  aprete el boton Asociar
                </p>
                 <div v-if="startTimer" style="text-align:center">
                   <Timer :time="time" @time-is-up="timeUp" />
                 </div>

                      
          </div>
      
          <b-modal v-model="testingModal" :width="640"  scroll="clip" >
                  <div class="card"  >
                      <header class="modal-card-head">
                          <p class="modal-card-title">{{modalTestingTitle}} {{selectedSensor.name}}</p>
                          <button
                              type="button"
                              class="delete"
                              @click="alertTestingUrl"/>
                      </header>
                      <div class="card-content"  >
                            <p>{{modalTestingDescription}}
                            </p> 
                            <b-loading :is-full-page="false" v-model="testingModal" :can-cancel="false"></b-loading>
                      </div>
                      <footer class="modal-card-foot is-flex is-flex-direction-row is-justify-content-space-between">
                              <b-button
                              
                                  label="Cancelar"
                                  style="float:left"
                                  type="is-primary" 
                                  @click="alertTestingUrl"/>                          
                            
                      </footer>
                  </div>

            </b-modal>
      </instructions-modal>
    </section>
  </div>
</template>

<script>
import CardWidget from '@/components/CardWidget'
import Tiles from '@/components/Tiles'
import { mapGetters, mapActions,mapMutations } from 'vuex'
import Axios from 'axios'
import firebase from '@/firebase';

import TitleBar from '@/components/TitleBar'
import CardComponent from '@/components/CardComponent'
import InstructionsModal from '@/components/InstructionsModal'
import Timer from '@/components/Timer/mainTimer'
import CheckboxPicker from '@/components/CheckboxPicker'
import RadioPicker from '@/components/RadioPicker'
import FilePicker from '@/components/FilePicker'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'SensorAsociation',
  components: {
    HeroBar,
    FilePicker,
    RadioPicker,
    CheckboxPicker,
    CardComponent,
    TitleBar,
    Tiles,
    CardWidget,
    InstructionsModal,
    Timer
    
  },
  data () {
    return {
      time:302,
      minutes:5,
			seconds:0,
      modalBool:false,
      isLoading: false,
      startTimer: false,
      chessUserName:'',
      online:null,
      form: {
        name: null,
        email: null,
        phone: null,
        department: null,
        subject: null,
        question: null
      },
      customElementsForm: {
        checkbox: [],
        radio: null,
        switch: true,
        file: null
      },
      departments: ['Business Development', 'Marketing', 'Sales'],
      instructionToggle: false,
      selectedSensor:{},
      trelloUsername:'',
      trelloKey:'',
      trelloToken:'',
      testingModal: false,

      modalTestingTitle: 'Testing de parametros de asociacion al sensor',
      modalTestingDescription: 'Se esta realizando una llamada al servicio para asegurar que los parametros son correctos',
    }
  },
  filters: {
		 prettify : function(value) {
			  let data = value.split(':')
			  let minutes = data[0]
			  let seconds = data[1]
			  if (minutes < 10) {
					minutes = "0"+minutes
			  }
			  if (secondes < 10) {
					seconds = "0"+seconds
			  }
			  return minutes+":"+seconds
		 }
	},
  computed: {
    ...mapGetters('sensor', {
          sensorTemplates: 'sensorTemplates',
          settingUpNewPlayer: 'settingUpNewPlayer',
          settingUpDissociationPlayer : 'settingUpDissociationPlayer',
          sensorsAndEndpoints : 'sensorsAndEndpoints'

    }),
    ...mapGetters('user', {
          id_player: 'id_player'
    }),
  },
  methods: {
    ...mapMutations('sensor',{
      SET_NEW_PLAYER_TOGGLE:'SET_NEW_PLAYER_TOGGLE',
      SET_DISSOCIATION_PLAYER_TOGGLE : 'SET_DISSOCIATION_PLAYER_TOGGLE'
    }),
    ...mapActions('sensor',{
      setNewPlayerSensorsAndEndpoints: 'setNewPlayerSensorsAndEndpoints',
      setDissociationSensorsAndEndpoints: 'setDissociationSensorsAndEndpoints'
    }),
    async trelloAssociation(){
      let testingUrl='https://api.trello.com/1/members/'+this.trelloUsername+'/boards?key='+this.trelloKey+'&token='+this.trelloToken
      this.alertTestingUrl()
      try {
          const response = await Axios.get(testingUrl)
          console.log(response)
          if(response.status === 200){
            this.alertTestingUrl()
            this.$buefy.dialog.alert({
                      title: 'Exito',
                      message: 'Se pudo corroborar que sus datos son correctos',
                      type: 'is-success',
                      hasIcon: true,
                      icon: 'check-circle',
                      iconPack: 'fa',
                      ariaRole: 'alertdialog',
                      ariaModal: true
            })
            
            const userData = {
              key: this.trelloKey,
              token: this.trelloToken,
              userName: this.trelloUsername
            }
            const metadata = {
              id_player: this.id_player,
              id_online_sensor: this.selectedSensor.id_online_sensor,
            }
            this.trelloUsername='',
            this.trelloKey='',
            this.trelloToken=''

            this.modalTestingTitle =  'Ajustando configuraciones '
            this.modalTestingDescription = 'Configurando y proveyendo los puntos de datos asociados al sensor '+ this.selectedSensor.name
            this.alertTestingUrl()
            await this.setNewPlayerSensorsAndEndpoints({userData: userData, metadata:metadata})
            console.log(this.settingUpNewPlayer)
            if(this.settingUpNewPlayer){
                  this.$buefy.dialog.alert({
                      title: 'Exito',
                      message: 'Ahora puede acceder a los puntos de datos correspondientes al sensor '+ this.selectedSensor.name,
                      type: 'is-success',
                      hasIcon: true,
                      icon: 'check-circle',
                      iconPack: 'fa',
                      ariaRole: 'alertdialog',
                      ariaModal: true
                })
                this.alertTestingUrl()
                this.modalTestingTitle = 'Testing de parametros de asociacion al sensor'
                this.modalTestingDescription = 'Se esta realizando una llamada al servicio para asegurar que los parametros son correctos'
                this.SET_NEW_PLAYER_TOGGLE()
                this.hideClick()
            }
          }
          else{
            this.alertTestingUrl()
            this.$buefy.dialog.alert({
                      title: 'Error',
                      message: 'No existe usuario con ese nombre de usuario en '+ this.selectedSensor.name +' por favor reviselo nuevamente',
                      type: 'is-success',
                      hasIcon: true,
                      icon: 'check-circle',
                      iconPack: 'fa',
                      ariaRole: 'alertdialog',
                      ariaModal: true
                })
                            this.hideClick()


          }
      } catch (error) {
          this.alertTestingUrl()
          this.$buefy.dialog.alert({
              title: 'Error',
              message: 'No existe usuario con ese nombre de usuario en '+ this.selectedSensor.name +' por favor reviselo nuevamente',
              type: 'is-danger',
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fa',
              ariaRole: 'alertdialog',
              ariaModal: true
          })
          this.hideClick()

      }
     
    },
    async associationClicked(){
        console.log('comenzando la verificacion de los datos')
        let testingUrl;
        switch (this.selectedSensor.name) {
          case 'Trello':
            this.trelloAssociation()
            break;
          case 'Chess.com':
            this.startTimerClick(false)        
          default:
            break;
        }
       
    },
    alertTestingUrl() {
        this.testingModal = !this.testingModal
        
    },
    hideClick(){
      this.startTimer = false
      this.modalBool = false
      this.trelloUsername='',
      this.trelloKey='',
      this.trelloToken=''
      this.chessUserName=''
    },
    async TwitterAssociation(){
      let provider = new firebase.auth.TwitterAuthProvider();
      const user = await firebase.auth().signInWithPopup(provider);
      console.log(user)
      const userData = {
          username: user.additionalUserInfo.username,
          id: user.additionalUserInfo.profile.id_str,
          accessToken: user.credential.accessToken,
          secret: user.credential.secret
      }
      const metadata = {
          id_player: this.id_player,
          id_online_sensor: this.selectedSensor.id_online_sensor,
      }
      this.modalTestingTitle =  'Ajustando configuraciones '
      this.modalTestingDescription = 'Configurando y proveyendo los puntos de datos asociados al sensor '+ this.selectedSensor.name
      this.alertTestingUrl()
      await this.setNewPlayerSensorsAndEndpoints({userData: userData, metadata:metadata})
      console.log(this.settingUpNewPlayer)
      if(this.settingUpNewPlayer){
            this.$buefy.dialog.alert({
                title: 'Exito',
                message: 'Ahora puede acceder a los puntos de datos correspondientes al sensor '+ this.selectedSensor.name,
                type: 'is-success',
                hasIcon: true,
                icon: 'check-circle',
                iconPack: 'fa',
                ariaRole: 'alertdialog',
                ariaModal: true
          })
          this.alertTestingUrl()
          this.modalTestingTitle = 'Testing de parametros de asociacion al sensor'
          this.modalTestingDescription = 'Se esta realizando una llamada al servicio para asegurar que los parametros son correctos'
          this.SET_NEW_PLAYER_TOGGLE()
          this.hideClick()
      }
    },

    async association (payload) {
      console.log(payload)
      console.log(this.modalBool)
      this.selectedSensor = payload
      if(this.selectedSensor.activation){
        if(this.selectedSensor.name !== 'Twitter'){
            this.modalBool = true
        }
        else{
           this.TwitterAssociation()
        }
      }
      else{
          let properTitle = 'Desasociacion del sensor '+this.selectedSensor.name
          let properMessage = 'Estas seguro que quieres <b>desacociarte</b> del sensor '+this.selectedSensor.name+'? \n No tendra acceso a los puntos de datos de este sensor y perdera sus configuraciones personales'
          this.$buefy.dialog.confirm({
              title: properTitle,
              message: properMessage,
              confirmText: 'Si',
              type: 'is-warning',
              hasIcon: true,
              onConfirm: () => {
                this.dissociationSensorsAndEndpoints(this.selectedSensor.id_online_sensor)
              
              } 
          })
      }
    },
    async dissociationSensorsAndEndpoints(id_online_sensor){
      await this.setDissociationSensorsAndEndpoints(id_online_sensor)
      console.log(this.settingUpDissociationPlayer)
      if(this.settingUpDissociationPlayer){
          this.$buefy.toast.open('Desasociacion del sensor '+this.selectedSensor.name+' realizada con exito!' )
      }
      else{
          this.$buefy.toast.open('Hubo un error con la desasociacion del sensor '+this.selectedSensor.name+' , porfavor realizarla nuevamente' )
      }
      this.SET_DISSOCIATION_PLAYER_TOGGLE()
      this.hideClick()

    },
    timeUp(){
      console.log('Se terminaron los minutos')
      this.startTimerClick(true)
    },
    async startTimerClick(toggle){
      console.log(toggle)
      const CHESS_URL = 'https://api.chess.com/pub/player/'+this.chessUserName+'/is-online'
      try {
        const reply = await Axios.get(CHESS_URL)
        if(reply.status !== 200){
           console.log('No existe este usuario')
            this.$buefy.dialog.alert({
                    title: 'Error username',
                    message: 'No existe este usuario en chess.com, porfavor ingrese uno existente',
                    type: 'is-danger',
                    hasIcon: true,
                    icon: 'times-circle',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
          })
          this.startTimer = false

        }
        else{
           if(toggle){
              this.alertTestingUrl()
              if(this.online !== reply.data.online){
                  console.log('Usuario autenticado!')
                        
                  const userData = {
                    name: this.chessUserName
                  }
                  const metadata = {
                    id_player: this.id_player,
                    id_online_sensor: this.selectedSensor.id_online_sensor,
                  }
                  this.chessUserName = ''
                  this.alertTestingUrl()

                  this.modalTestingTitle =  'Ajustando configuraciones '
                  this.modalTestingDescription = 'Configurando y proveyendo los puntos de datos asociados al sensor '+ this.selectedSensor.name
                  this.alertTestingUrl()
                  await this.setNewPlayerSensorsAndEndpoints({userData: userData, metadata:metadata})
                  console.log(this.settingUpNewPlayer)
                  if(this.settingUpNewPlayer){
                      this.$buefy.dialog.alert({
                            title: 'Exito',
                            message: 'Ahora puede acceder a los puntos de datos correspondientes al sensor '+ this.selectedSensor.name,
                            type: 'is-success',
                            hasIcon: true,
                            icon: 'check-circle',
                            iconPack: 'fa',
                            ariaRole: 'alertdialog',
                            ariaModal: true
                      })
                      this.alertTestingUrl()
                      this.modalTestingTitle = 'Testing de parametros de asociacion al sensor'
                      this.modalTestingDescription = 'Se esta realizando una llamada al servicio para asegurar que los parametros son correctos'
                      this.SET_NEW_PLAYER_TOGGLE()
                      this.hideClick()
                  }

              }
          }
          else{
            this.online = reply.data.online
            this.startTimer = true
          }

        }
       
      } catch (error) {
          console.log('Error de conexion')
            this.$buefy.dialog.alert({
                    title: 'Error de conexion',
                    message: 'El sitio chess.com no esta respondiendo por el momento, porfavor intente asociar su cuenta mas tarde',
                    type: 'is-danger',
                    hasIcon: true,
                    icon: 'times-circle',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
          })
          this.startTimer = false
      }
    }
  }
}
</script>
<style >
div p{
  margin-top:1em;
}
</style>