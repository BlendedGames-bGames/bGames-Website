<template>
  <div>
    <hero-bar>
      Menu de sensores
    </hero-bar>
    <section class="section is-main-section">
      <b-loading :is-full-page="true" v-model="loadingTwitter" :can-cancel="false"></b-loading>
      <card-component title="Forms" icon="ballot" simpleButton simpleButtonLabel="Agregar" @handle-simple-click="addSensor">
          <tiles>
             <card-widget-sensor
                v-for="(sensor, index) in sensorTemplates"
                :key="index"
                class="tile is-child"
                type="is-primary"
                icon="account-multiple"
                :id="sensor.id_online_sensor"
                :image="sensor.image"
                :description="sensor.description"
                :label="sensor.name"
                @handle-edit-action="editSensor"
                @handle-delete-action="deleteSensor"

                /> 
            
          </tiles>
      </card-component>
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
   
      
      <b-modal v-model="addSensorModal" :width="640"  scroll="clip" >
              <div class="card"  >
                  <header class="modal-card-head">
                      <p class="modal-card-title">Agregar sensores</p>
                      <button
                          type="button"
                          class="delete"
                          @click="addSensorModalToggle"/>
                  </header>
                  <div class="card-content"  >
                      <b-steps
                            v-model="activeStep"
                            :animated="isAnimated"
                            :rounded="isRounded"
                            :has-navigation="hasNavigation"
                            :icon-prev="prevIcon"
                            :icon-next="nextIcon"
                            :label-position="labelPositionTabs"
                            :mobile-mode="mobileMode">
                            <b-step-item step="1" label="Datos Generales" :clickable="isStepsClickable">
                                <h1 class="title has-text-centered">Datos Generales</h1>
                                <b-field label="Nombre" custom-class="margin:0">
                                  <b-input  v-model="generalData.name"
                                            required>
                                  </b-input>
                                </b-field>
                                <b-field label="Descripcion">
                                    <b-input maxlength="200" type="textarea" 
                                              v-model="generalData.description"
                                            required></b-input>
                                </b-field>
                                <b-field label="Url base" custom-class="margin:0">
                                  <b-input  v-model="generalData.url"
                                            required>
                                  </b-input>
                                </b-field>
                                <b-field label="Link de documentacion" custom-class="margin:0">
                                  <b-input  v-model="generalData.docuLink"
                                            required>
                                  </b-input>
                                </b-field>
                                  <b-field label="Link de imagen" custom-class="margin:0">
                                  <b-input  v-model="generalData.imageLink"
                                            required>
                                  </b-input>
                                </b-field>
                            </b-step-item>

                            <b-step-item step="2" label="Llaves" :clickable="isStepsClickable" :type="{'is-success': isProfileSuccess}">
                                <h1 class="title has-text-centered">Llaves</h1>
                                <p class="modal-card-title">Ingrese los nombres de las llaves de autenticacion/autorizacion del sensor:</p>
                                <div class="columns">
                                  <div class="column is-3">
                                     <div style="padding-top:1em"></div>
                                      <b-button
                                        rounded
                                        type="is-info"
                                        icon-pack="mdi"
                                        icon-left="plus"
                                        @click="addKey"
                                        >
                                    </b-button>

                                  </div>
                                  <div class="column is-6">
                                       <div class="is-flex is-flex-direction-column is-align-items-center">                                         
                                            <div v-for="(key, index) in keyNames"                               
                                                :key="index" style="padding-top:1em">
                                                <div class="is-flex is-flex-direction-row is-align-items-center">
                                                     <b-input v-model="key.name"                                                                                                               
                                                              >
                                                    </b-input>
                                                    <b-button
                                                       
                                                        rounded
                                                        type="is-danger"
                                                        icon-pack="mdi"
                                                        icon-left="minus"
                                                        @click="substractKey(index)"
                                                        >
                                                  </b-button>


                                                </div>
                                                 
                                            </div>
                                        </div>
                                  </div>
                                  <div class="column is-3"  >
                                   
                                  </div>
                                </div>
                                <div class=""></div>     
                                
                                <p class="modal-card-title">Si es que tiene llaves preestablecidas exclusivas, ingrese sus nombres y valores:</p>
                                <div class="columns">
                                    <div class="column is-2">
                                        <div style="padding-top:1em"></div>
                                        <b-button
                                          rounded
                                          type="is-info"
                                          icon-pack="mdi"
                                          icon-left="plus"
                                          @click="addExclusiveKey"
                                          >
                                        </b-button>

                                    </div>
                                    <div class="column is-10">
                                        <div class="is-flex is-flex-direction-column is-align-items-center">                                         
                                              <div v-for="(key, index) in exclusiveKeyNames"                               
                                                  :key="index" style="padding-top:1em">
                                                  <div class="is-flex is-flex-direction-row is-align-items-center">
                                                      <b-field label="Name" label-position="on-border">
                                                            <b-input  v-model="key.name">
                                                             </b-input>
                                                      </b-field>
                                                      <b-field label="Valor" label-position="on-border">
                                                            <b-input v-model="key.valor">
                                                            </b-input>
                                                      </b-field>

                                                  
                                                      
                                                      <b-button                                                        
                                                          rounded
                                                          type="is-danger"
                                                          icon-pack="mdi"
                                                          icon-left="minus"
                                                          @click="substractExclusiveKey(index)"
                                                          >
                                                      </b-button>
                                                  </div>                                                  
                                              </div>
                                          </div>
                                    </div>
                                  </div>
                            
                            
                            </b-step-item>

                            <b-step-item step="3"  label="Probar y Guardar" :clickable="isStepsClickable">
                                <h1 class="title has-text-centered">Probar y Guardar</h1>
                                <p class="modal-card-title">Pruebe su sensor ingresando una url basica existente:</p>
                                <div style="padding-top:1em"></div>

                                <div class="is-flex is-flex-direction-row ">

                                    <b-input v-model="generalData.url" disabled></b-input>
                                    <b-input  style="width:75%" expanded v-model="testingData.urlExtension" >
                                    </b-input>

                                </div>
                                <div style="padding-top:1em"></div>

                                 <p class="modal-card-title">Si es que tiene parametros de identificacion/campos que se envian por
                                   header, porfavor ingreselos a continuacion en formato <b>JSON</b>:
                                   </p>
                                <div style="padding-top:1em"></div>
                                <b-input maxlength="1000" type="textarea" 
                                          v-model="testingData.headerParameters"
                                        required></b-input>
                                <div style="padding-top:1em"></div>
                                <div class="is-flex is-flex-direction-row is-justify-content-center">

                                  <b-button
                                          rounded
                                          type="is-info"
                                          @click="testSensor"
                                          >
                                          Testing 
                                        </b-button>

                                  
                                </div>
                                <div style="padding-top:1em"></div>

                                <div class="">

                                    <b-field label="Codigo" label-position="on-border">
                                          <b-input style="width:20%">
                                            </b-input>
                                    </b-field>
                                    <div style="padding-top:1em"></div>
                                    <pre>{{ JSON.stringify({'name':4}, null, '\t') }}</pre>
                                  
                                </div>


                                <p class="modal-card-title">Si esta satisfecho con los resultados mostrados, guarde el sensor!
                                </p>

                            </b-step-item>

                            <hr/>

                            <template
                                v-if="customNavigation"
                                #navigation="{previous, next}">
                                <div class="is-flex is-flex-direction-row is-justify-content-space-between">
                                    <b-button
                                        
                                        type="is-danger"
                                        icon-pack="fas"
                                        icon-left="backward"
                                        :disabled="previous.disabled"
                                        @click.prevent="previous.action"
                                        @click="beforeClick"
                                        >
                                        Antes
                                    </b-button>
                                    <b-button
                                        
                                        type="is-success"
                                        icon-pack="fas"
                                        icon-right="forward"
                                        :disabled="next.disabled"
                                        @click.prevent="next.action"
                                        @click="afterClick"
                                        >
                                        Siguiente
                                    </b-button>


                                </div>
                             
                            </template>
                      </b-steps>


                  </div>
              </div>

        </b-modal>
    </section>
  </div>
</template>

<script>
import CardWidgetSensor from '@/components/CardWidgetSensor'
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
  name: 'SensorCRUD',
  components: {
    HeroBar,
    FilePicker,
    RadioPicker,
    CheckboxPicker,
    CardComponent,
    TitleBar,
    Tiles,
    CardWidgetSensor,
    InstructionsModal,
    Timer
    
  },
  data () {
    return {
      generalData: {
        name:'',
        descripcion:'',
        url:'',
        docuLink:'',
        imageLink:''

      },
      testingData: {
        urlExtension: '',
        headerParameters:'{\n \n \n \n}'
      },
      keyNames: [{name:''}],
      exclusiveKeyNames: [
        {name:'',valor:''}
      ],
      labelPosition: 'on-border',
      activeStep: 0,

      showSocial: false,
      isAnimated: true,
      isRounded: true,
      isStepsClickable: false,

      hasNavigation: true,
      customNavigation: true,
      isProfileSuccess: false,

      prevIcon: 'chevron-left',
      nextIcon: 'chevron-right',
      labelPositionTabs: 'bottom',
      mobileMode: 'minimalist',
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
      addSensorModal:false,

      loadingTwitter:false,

      modalTestingTitle: 'Testing de parametros de asociacion al sensor',
      modalTestingDescription: 'Se esta realizando una llamada al servicio para asegurar que los parametros son correctos',
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
  mounted(){
    this.SET_CURRENT_ROUTE('/sensor_asociation')
    window.localStorage.setItem('route','/sensor_asociation' )
  },
  methods: {
    //SET_CURRENT_ROUTE
    ...mapMutations('sensor',{
      SET_NEW_PLAYER_TOGGLE:'SET_NEW_PLAYER_TOGGLE',
      SET_DISSOCIATION_PLAYER_TOGGLE : 'SET_DISSOCIATION_PLAYER_TOGGLE'
    }),
    ...mapMutations({
      SET_CURRENT_ROUTE:'SET_CURRENT_ROUTE'
    }),
    ...mapActions('sensor',{
      setNewPlayerSensorsAndEndpoints: 'setNewPlayerSensorsAndEndpoints',
      setDissociationSensorsAndEndpoints: 'setDissociationSensorsAndEndpoints'
    }),


    addSensorModalToggle(){
      this.addSensorModal = !this.addSensorModal
    },
    addKey(){
      this.keyNames.push({name:''})

    },
    substractKey(index){
      this.keyNames.splice(index,1)

    },
    addExclusiveKey(){
      this.exclusiveKeyNames.push({name:'', valor:''})

    },
    substractExclusiveKey(index){
      this.exclusiveKeyNames.splice(index,1)

    },

    beforeClick(){
      console.log('click before')
    },
    afterClick(){
      console.log('click after')
    },

    testSensor(){
      console.log('testing sensor')
    },


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
                this.loadingTwitter = false
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
          this.loadingTwitter = false


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
          this.loadingTwitter = false


      }
     
    },
    async associationClicked(){
        console.log('comenzando la verificacion de los datos')
        let testingUrl;
        this.loadingTwitter = true

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
      this.loadingTwitter = true
      let provider = new firebase.auth.TwitterAuthProvider();
      const user = await firebase.auth().signInWithPopup(provider);
      console.log(user)
      const userData = {
          username: user.additionalUserInfo.username,
          ids: user.additionalUserInfo.profile.id_str,
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
          this.loadingTwitter = false
      }
    },
     async addSensor (payload) {
      console.log('add sensor')
      this.addSensorModalToggle()
    
    },

    async editSensor (payload) {
      console.log('edit sensor')
    
    },
    async deleteSensor (payload) {
      console.log('delete sensor')
    
      let properTitle = 'Eliminar sensor '+payload.name
      let properMessage = 'Estas seguro que quieres <b>desacociarte</b> del sensor '+payload.name+'? \n No tendra acceso a los puntos de datos de este sensor y perdera sus configuraciones personales'
      this.$buefy.dialog.confirm({
          title: properTitle,
          message: properMessage,
          confirmText: 'Si',  
          type: 'is-warning',
          hasIcon: true,
          onConfirm: () => {
            //this.loadingTwitter = true
           // this.dissociationSensorsAndEndpoints(this.selectedSensor.id_online_sensor)
          
          } 
      })
      
    },
    async dissociationSensorsAndEndpoints(id_online_sensor){
      await this.setDissociationSensorsAndEndpoints(id_online_sensor)
      console.log(this.settingUpDissociationPlayer)
      if(this.settingUpDissociationPlayer){
          this.$buefy.toast.open('Desasociacion del sensor '+this.selectedSensor.name+' realizada con exito!' )
      }
      else{
          this.$buefy.toast.open('Hubo un error con la desasociacion del sensor '+this.selectedSensor.name+' , porfavor realizar la accion nuevamente' )
      }
      this.SET_DISSOCIATION_PLAYER_TOGGLE()
      this.hideClick()
      this.loadingTwitter = false

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
              if(toggle){
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