<template>
  <div>
    <hero-bar>
      Asociacion a sensores basados en software
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
                @handle-associate-action="association"
                />
            
          </tiles>
      </card-component>
      <instructions-modal   v-if="modalBool" :sensorName="selectedSensor.name" @associate-hide-click="hideClick" @associate-verification-click="associationClicked"> 
          <div class="instructions" v-if="selectedSensor.name === 'Trello'" >
                <p>
                  Primero que todo, debe estar <b>autenticado</b> con anterioridad en <a href="https://trello.com/home"></a>
                  para poder asociar Trello con Blended Games
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
                <b-field label="chess">
                              <b-input
                                  placeholder="Your email"
                                  
                                  required>
                              </b-input>
                  </b-field>
          </div>
        <div  class="instructions" v-else-if="selectedSensor.name === 'Linkedin'">
                <b-field label="linkedin">
                              <b-input
                                  placeholder="Your email"
                                  
                                  required>
                              </b-input>
                  </b-field>


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
import { mapGetters, mapActions } from 'vuex'
import Axios from 'axios'

import TitleBar from '@/components/TitleBar'
import CardComponent from '@/components/CardComponent'
import InstructionsModal from '@/components/InstructionsModal'

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
    InstructionsModal
    
  },
  data () {
    return {
      modalBool:false,
      isLoading: false,
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
  computed: {
    ...mapGetters('sensor', {
          sensorTemplates: 'sensorTemplates',
          settingUpNewPlayer: 'settingUpNewPlayer'
    }),
    ...mapGetters('user', {
          id_player: 'id_player'
    }),
  },
  methods: {
    ...mapActions('sensor',{
      setNewPlayerSensorsAndEndpoints: 'setNewPlayerSensorsAndEndpoints'
    }),
    async associationClicked(){
        console.log('comenzando la verificacion de los datos')
        let testingUrl;
        switch (this.selectedSensor.name) {
          case 'Trello':
            testingUrl='https://api.trello.com/1/members/'+this.trelloUsername+'/boards?key='+this.trelloKey+'&token='+this.trelloToken
            break;
        
          default:
            break;
        }
        this.alertTestingUrl()
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
              this.hideClick()
          }
        }
    },
    alertTestingUrl() {
        this.testingModal = !this.testingModal
        
    },
    hideClick(){
      this.modalBool = false
       this.trelloUsername='',
          this.trelloKey='',
          this.trelloToken=''
    },
    association (payload) {
      console.log(payload)
      this.selectedSensor = payload
      this.modalBool = true
    },
  }
}
</script>
<style >
div p{
  margin-top:1em;
}
</style>