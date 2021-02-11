<template>
  <div>
    <b-table
      v-if="loaded"
      :checked-rows.sync="checkedRows"
      :checkable="checkable"
      :loading="isLoading"
      :paginated="paginated"
      :per-page="perPage"
      :striped="true"
      :hoverable="true"
      default-sort="name"
      :data="local_sensor_endpoints"
    >
      
      <b-table-column label="Nombre" field="name_sensor_endpoint" sortable v-slot="props">
        {{ props.row.name_sensor_endpoint }}
      </b-table-column>
      <b-table-column label="Descripcion" field="description" sortable v-slot="props">
        {{ props.row.description }}
      </b-table-column>
      <b-table-column label="Parametros capturados" field="watch_parameters" v-slot="props">
          <b-button  icon-left="magnify-plus" native-type="submit" rounded type="is-info" @click="viewCapturedParameters(props.row.watch_parameters, props.row.name_sensor_endpoint)">
                              
          </b-button>     
      </b-table-column>
      <b-table-column label="Parametros especificos" field="schedule_time"  v-slot="props">
        <b-button :disabled="!props.row.specific_parameters" icon-left="magnify-plus" native-type="submit" rounded type="is-info" 
        @click="viewSpecificParameters(props.row.specific_parameters, props.row.specific_parameters_template, props.row.name_sensor_endpoint)">
                              
        </b-button>   

           <b-button :disabled="!props.row.specific_parameters" icon-left="pencil" native-type="submit" rounded type="is-success" 
           @click="settingSpecificParameters(props.row.id_sensor_endpoint,props.row.id_online_sensor, props.row.specific_parameters_template, props.row.specific_parameters,props.row.token_parameters,props.row.tokens,props.row.base_url,props.row.url_endpoint, props.row.dynamic_url,props.row.name_sensor_endpoint)">
                              
        </b-button>
      
      </b-table-column>
      <b-table-column label="Tiempo de activacion (seg)"  field="schedule_time" sortable v-slot="props">
            <b-numberinput v-model="props.row.schedule_time" controls-alignment="right" size="is-small" controls-position="compact" controls-rounded></b-numberinput>
      </b-table-column>
     <b-table-column  label="Activacion" field="activated" sortable v-slot="props">
        <b-field             class="is-flex is-flex-direction-row is-justify-content-center"
>
            <b-switch
                v-model="props.row.activated"
                @input="confirmSwitchToggle(props.row.activated, props.row.id_online_sensor, props.row.id_sensor_endpoint)"
                passive-type='is-dark'
                type='is-warning'>
            </b-switch>
        </b-field>
      </b-table-column>
      <b-table-column label="Ultima modificacion" centered v-slot="props">
        <span class="tag is-success">
                    {{ new Date(props.row.last_modified).toLocaleString() }}
        </span>
      </b-table-column>
     <section slot="empty" class="section">
        <div class="content has-text-grey has-text-centered">
          <template v-if="isLoading">
            <p>
              <b-icon icon="dots-horizontal" size="is-large" />
            </p>
            <p>Fetching data...</p>
          </template>
          <template v-else>
            <p>
              <b-icon icon="emoticon-sad" size="is-large" />
            </p>
            <p>Nothing's here&hellip;</p>
          </template>
        </div>
      </section>
    </b-table>
    
   
    <b-modal v-model="viewCapturedParametersActive" :width="640" scroll="keep">
                <form action="">
                  <div class="modal-card" style="width: auto">
                      <header class="modal-card-head">
                          <p class="modal-card-title">Parametros capturados en el punto de datos</p>
                          <button
                              type="button"
                              class="delete"
                              @click="viewCapturedParametersActive = false"/>
                      </header>
                      <section class="modal-card-body">
                            <b-field label="Nombre">
                              <b-input
                                  :value="name_sensor_endpoint_view"
                                  placeholder="Your email"
                                  disabled
                                  required>
                              </b-input>
                          </b-field>

                          <b-table
                            :striped="true"
                            :hoverable="true"
                            :data="watch_parameters_captured"
                          >
                           <b-table-column label="Nombre" field="name_sensor_endpoint" sortable v-slot="props">
                            {{ props.row.name }}
                          </b-table-column>
                          <b-table-column label="Descripcion" field="description" sortable v-slot="props">
                            {{ props.row.description }}
                          </b-table-column>
                          </b-table>
                      </section>
                       <footer class="modal-card-foot">
                       
                      </footer>
                  </div>
              </form>
        </b-modal>
     <b-modal v-model="editSpecificParametersActive" :width="640" scroll="keep" :on-cancel="resettingDataAndClose">
                <form action="">
                  <div class="modal-card" style="width: auto">
                      <header class="modal-card-head">
                          <p v-if="editionModalTotalCount > 1" class="modal-card-title">Edicion del punto de datos [{{editionModalActual+1}}/{{editionModalTotalCount}}]</p>
                          <p  class="modal-card-title" v-else> Edicion del punto de datos </p>
                          <button
                              type="button"
                              class="delete"
                              @click="resettingDataAndClose()"/>
                      </header>
                      <section class="modal-card-body">
                        <b-field label="Nombre">
                              <b-input
                                  :value="name_sensor_endpoint_edit"
                                  placeholder="Your email"
                                  disabled
                                  required>
                              </b-input>
                          </b-field>

                          {{editMessage}}

                          <b-field :label="search_param"  style="margin-top:0.5em" :type="{ 'is-danger': hasError || hasErrorCall }"
                                  :message="[
                                      { 'Parametro no encontrado, intentar nuevamente': hasError },
                                      { 'Sugerencia: Escribir completamente el valor respetando mayusculas y simbolos': hasError },
                                      {'No se ha podido obtener el valor, intentar nuevamente':hasErrorCall}
                                  ]">
                              <b-input
                                  :value="editionOption"
                                  v-model="editionOption"
                                  
                                  required>
                              </b-input>
                          </b-field>
                          <b-loading :is-full-page="false" v-model="isLoadingEditSpecificParameters" :can-cancel="false"></b-loading>
                      </section>
                      <footer class="modal-card-foot">
                          <b-button
                              v-if="editionModalTotalCount > 1 && editionModalActual >= 1"
                              label="Anterior"
                              style="float:left"
                              type="is-primary" 
                              @click="goBack()"/>                          
                          <b-button
                              v-if="editionModalActual === editionModalTotalCount-1"
                              label="Guardar cambios"
                              type="is-primary" 
                              style="float:right"

                              @click="queryAndGettingInfo()"
                              />
                          <b-button
                              v-else
                              label="Siguiente"
                              type="is-primary" 
                              style="float:right"

                              @click="queryAndGettingInfo()"/>
                      </footer>
                  </div>
              </form>
        </b-modal>
    <b-modal v-model="successModal"   :width="350" scroll="keep">
        <form action="">
                  <div class="modal-card" style="width: auto">
                      <header class="modal-card-head">
                          <p class="modal-card-title">Exito</p>
                          <button
                              type="button"
                              class="delete"
                              @click="successModal = false"/>
                      </header>
                      <section class="modal-card-body">
                            Se actualizo existosamente el punto de datos {{name_sensor_endpoint_edit}}
                      </section>
                      <footer class="modal-card-foot">
                      </footer>
                  </div>
              </form>
    </b-modal>
     <b-modal v-model="viewSpecificParametersActive" :width="640" scroll="keep">
                <form action="">
                  <div class="modal-card" style="width: auto">
                      <header class="modal-card-head">
                          <p class="modal-card-title">Especificacion del punto de datos</p>
                          <button
                              type="button"
                              class="delete"
                              @click="viewSpecificParametersActive = false"/>
                      </header>
                      <section class="modal-card-body">
                          <b-field label="Nombre">
                              <b-input
                                  :value="name_sensor_endpoint_view"
                                  placeholder="Your email"
                                  disabled
                                  required>
                              </b-input>
                          </b-field>

                          <div v-for="(option, index) in specific_parameters_view" :key="index" style="margin-top:1em">
                              {{option.message}}
                              <b-field >
                                <b-input
                                    :value="option.data"
                                    required>
                                </b-input>
                              </b-field>
                          </div>
                      </section>
                       <footer class="modal-card-foot">
                       
                      </footer>
                  </div>
              </form>
        </b-modal>
  </div>
</template>

<script>
import Axios from 'axios'
import ModalBox from '@/components/ModalBox'
import { mapGetters, mapMutations } from 'vuex'
import {baseURL, sensorPort} from '../store/urls'

export default {
  name: 'SensorEndpointTable',
  components: { ModalBox },
  props: {
    checkable: {
      type: Boolean,
      default: false
    },
    sensor_endpoints: {
      type:Array,
      default: []
    }
  },
  
  data () {
    return {
      isModalActive: false,
      trashObject: null,
      table_data: [],
      isLoading: false,
      paginated: false,
      perPage: 10,
      checkedRows: [],
      sensorURL:baseURL+sensorPort,
      loaded:false,
      viewSpecificParametersActive: false,
      editSpecificParametersActive: false,
      viewCapturedParametersActive: false,
      email:'',
      password:'',
      successModal:false,
      hasError:false,
      hasErrorCall:false,

      local_sensor_endpoints:null,
      name_sensor_endpoint_view:'',
      specific_parameters_view: null,
      specific_parameters_template_view: null,

      id_sensor_endpoint_edit:null,
      id_online_sensor_edit: null,
      name_sensor_endpoint_edit: '',
      specific_parameters_edit: null,
      specific_parameters_template_edit: null,
      token_parameters_edit: null,
      tokens_edit:null,
      base_url_edit:null,
      url_endpoint_edit:null,
      dynamic_url_edit:null,
      watch_parameters_captured: null,
      retrieve_params: [],
      retrieve_names: [],

      editionModalTotalCount: 0,
      editionModalActual:0,
      search_param: '',
      editionOption:'',
      editMessage: '',
      

      isLoadingEditSpecificParameters:false

    }
  },
  watch: {
    // whenever question changes, this function will run
    sensor_endpoints: function (newSensor, oldSensor) {
      this.local_sensor_endpoints = newSensor
      console.log(newSensor,oldSensor)
      this.loadingData()
    }
  },
  computed: {
     ...mapGetters('user', {
          userDimensionLevels: 'userDimensionLevels',
          userLevels: 'userLevels',
          id_player: 'id_player',
          dimensionSocket: 'dimensionSocket'
    }),
    ...mapGetters('sensor', {
          sensorsAndEndpoints: 'sensorsAndEndpoints'
    }),
  },
  mounted () {
    this.local_sensor_endpoints = this.sensor_endpoints
    this.loadingData()
  },
  methods: {
    ...mapMutations('sensor',{
      SET_SPECIFIC_PARAMETERS_SINGLE: 'SET_SPECIFIC_PARAMETERS_SINGLE',
      SET_ENDPOINT_ACTIVATION: 'SET_ENDPOINT_ACTIVATION'
    }),
    async confirmSwitchToggle(bool, id_online_sensor, id_sensor_endpoint) {
      var properTitle, properMessage
      console.log(bool)
      if(!bool){
        properTitle = 'Desactivar observacion del punto de datos'
        properMessage = 'Estas seguro que quieres <b>desactivar</b> la observacion de este punto de datos?'
       }
       else{
        properTitle = 'Activar observacion del punto de datos'
        properMessage = 'Estas seguro que quieres <b>activar</b> la observacion de este punto de datos?'
      }
      this.$buefy.dialog.confirm({
          title: properTitle,
          message: properMessage,
          confirmText: 'Si',
          type: 'is-warning',
          hasIcon: true,
          onCancel: () => {
            this.setEndpointActivation({activated: !bool, id_sensor_endpoint:id_sensor_endpoint, id_online_sensor:id_online_sensor })           
          } ,
          onConfirm: () => {
            this.activationEndpointRequest(bool, id_online_sensor, id_sensor_endpoint)
           
          } 
      })
    },
    async activationEndpointRequest(bool, id_online_sensor, id_sensor_endpoint){
        this.setEndpointActivation({activated: bool, id_sensor_endpoint:id_sensor_endpoint, id_online_sensor:id_online_sensor })
        this.SET_ENDPOINT_ACTIVATION({activated: bool, id_sensor_endpoint:id_sensor_endpoint, id_online_sensor:id_online_sensor })
        const SENSOR_URL = this.sensorURL+'/sensor_endpoint/'+this.id_player+'/'+id_sensor_endpoint+'/activation'
        let activate = bool ? 0 : 1
        const data = {
          activated: activate
        }
        console.log('paso por aqui')
        try {
              const putConfirmation = await Axios.put(SENSOR_URL, data)
              console.log(putConfirmation)
              this.$buefy.toast.open(!bool ? 'Observacion del punto de datos desactivada':'Observacion del punto de datos activada' )

        } catch (error) {
              this.$buefy.toast.open('Hubo un error en la activacion, intente nuevamente')

        }
    },
    setSpecificParametersSingle(payload){
      console.log(this.local_sensor_endpoints)
      console.log(payload)
      this.local_sensor_endpoints.forEach((sensor) => {    
        if(sensor.id_online_sensor === payload.id_online_sensor){
            if(sensor.id_sensor_endpoint  == payload.id_sensor_endpoint){
                sensor.specific_parameters = JSON.stringify(payload.specific_parameters)
              } 
          }
      });

    },
    setEndpointActivation(payload){
      console.log(this.local_sensor_endpoints)
      console.log(payload)
      this.local_sensor_endpoints.forEach((sensor) => {    
        if(sensor.id_online_sensor === payload.id_online_sensor){
            if(sensor.id_sensor_endpoint  == payload.id_sensor_endpoint){
                sensor.activated = payload.activated
              } 
          }
      });

    },
    resettingDataAndClose(){
      console.log('asdsadsda')
      this.editionModalTotalCount =  0
      this.editionModalActual = 0
      this.search_param = ''
      this.editionOption = ''
      this.editMessage = ''
      this.retrieve_params.splice(0)
      this.retrieve_names.splice(0)
      this.editSpecificParametersActive = false
      this.isLoadingEditSpecificParameters = false
    },
    goBack(){
      this.editionModalActual--
      console.log(this.editionModalActual)
      console.log(this.retrieve_names)
      let actualSpecificTemplate = this.specific_parameters_template_edit.parameters[this.editionModalActual]
      this.editMessage = actualSpecificTemplate.instruction
      this.search_param = actualSpecificTemplate.search_data.search_param 
      this.editionOption = this.retrieve_names[this.editionModalActual]
      this.retrieve_params[this.editionModalActual+1] = {}
      this.retrieve_names.splice([this.editionModalActual+1])
    },
    createURL(){
      let actualSpecificTemplate = this.specific_parameters_template_edit.parameters[this.editionModalActual]
      console.log(actualSpecificTemplate)
      let validUrl = this.base_url_edit+this.url_endpoint_edit
      console.log(validUrl)
      console.log(this.dynamic_url_edit)
      console.log(actualSpecificTemplate.search_data.url)

      let queryUrl = validUrl.replace(this.dynamic_url_edit,actualSpecificTemplate.search_data.url)       
      console.log(queryUrl)
      console.log(actualSpecificTemplate.search_data.hasOwnProperty('token_params'))
      console.log(actualSpecificTemplate.search_data.hasOwnProperty('url_params'))
      if(actualSpecificTemplate.search_data.hasOwnProperty('token_params')){
        //Replace token that is not in the main url token part
        console.log('paso por aqui')
        var tokensKeys = Object.keys(actualSpecificTemplate.search_data.token_params)
        console.log(tokensKeys)
        for (const key of tokensKeys) {
          queryUrl = queryUrl.replace(actualSpecificTemplate.search_data.token_params[key],this.tokens_edit[key])
        }
      }
      if(actualSpecificTemplate.search_data.hasOwnProperty('url_params')){
        //Replace specific parameter (used when having to do multiple queries with )
        var tokensKeys = Object.keys(actualSpecificTemplate.search_data.url_params)
        console.log(tokensKeys)
        for (const key of tokensKeys) {
          for (const param of this.retrieve_params) {
            if(param.hasOwnProperty(key)){
                queryUrl = queryUrl.replace(actualSpecificTemplate.search_data.url_params[key],param[key])
                break
            } 
          }
        }
      }
      //Replacing constant player's personal token keys
      var tokensKeys = Object.keys(this.tokens_edit)
      var parametersKeys = Object.keys(this.token_parameters_edit)
      for(const tkey of tokensKeys){
            for(const pkey of parametersKeys){
                console.log(tkey)
                console.log(pkey)
                if(tkey == pkey){
                  var tokenValue = this.tokens_edit[tkey]
                  var parameterValue = this.token_parameters_edit[tkey]
                  queryUrl = queryUrl.replace(parameterValue, tokenValue)
                  
                }
            }	
        
      }
      console.log(queryUrl)
      return queryUrl

    },

    async queryAndGettingInfo(){
      this.isLoadingEditSpecificParameters = true
      let actualSpecificTemplate = this.specific_parameters_template_edit.parameters[this.editionModalActual]
      this.hasError = false
      let urlQuery = this.createURL()
      console.log(urlQuery)
      try {
          this.hasErrorCall = false
          const query = await Axios.get(urlQuery)
          const queryData = query.data
          let search_param = actualSpecificTemplate.search_data.search_param
          let retrieve_param = actualSpecificTemplate.search_data.retrieve_param
          var result;
          for (const record of queryData) {
            console.log(record[search_param])
            console.log(this.editionOption)
            if(record[search_param] === this.editionOption){
                result = record[retrieve_param]
                break
            }        
          }
          console.log(retrieve_param)
          if(result){
              this.retrieve_params[this.editionModalActual][retrieve_param] = result
              this.retrieve_names[this.editionModalActual] = this.editionOption
              console.log(this.retrieve_params)
              this.editionModalActual++
              if(this.editionModalActual === this.editionModalTotalCount){
                //Guardar en la db el nuevo valor del parametro especifico y luego en el vuex store
                //
                console.log(this.retrieve_names)
                console.log(this.retrieve_params)
                //await Axios.put('/sensor_endpoint/:id_players/:id_sensor_endpoint')
                const SENSOR_URL = this.sensorURL+'/sensor_endpoint/'+this.id_player+'/'+this.id_sensor_endpoint_edit
                let actual_data = []
                for (const name of this.retrieve_names) {
                  actual_data.push({data:name})
                }
                console.log(actual_data)

                let specific_params_new = {}
                let params_index = 0
                console.log(this.specific_parameters_template_edit.parameters)
                for (const parameter  of this.specific_parameters_template_edit.parameters) {
                  if(parameter.search_data.hasOwnProperty('specific_param')){
                    specific_params_new[parameter.search_data.specific_param] = this.retrieve_params[params_index][parameter.search_data.retrieve_param]
                  }
                  else{
                    params_index++
                  }
                }
                console.log(specific_params_new)
                specific_params_new['actual_data'] = actual_data
                console.log(specific_params_new)
                let specific_params_new_string = JSON.stringify(specific_params_new)
                console.log(specific_params_new_string)
                const data = {
                  "specific_parameters": specific_params_new_string
                }
                const putConfirmation = await Axios.put(SENSOR_URL, data)
                this.SET_SPECIFIC_PARAMETERS_SINGLE({specific_parameters: specific_params_new_string, id_sensor_endpoint:this.id_sensor_endpoint_edit, id_online_sensor:this.id_online_sensor_edit })
                this.setSpecificParametersSingle({specific_parameters: JSON.parse(specific_params_new_string), id_sensor_endpoint:this.id_sensor_endpoint_edit, id_online_sensor:this.id_online_sensor_edit })
                this.resettingDataAndClose()
                this.successModal = true


              }
              else{
                  //Setting next modal modal
                  actualSpecificTemplate = this.specific_parameters_template_edit.parameters[this.editionModalActual]
                  this.editMessage = actualSpecificTemplate.instruction
                  this.search_param = actualSpecificTemplate.search_data.search_param 
                  console.log(this.editionModalActual)
                  console.log(this.editionModalTotalCount)
                  this.isLoadingEditSpecificParameters = false
                  this.editionOption = ''
                  this.hasError = false
                  this.hasErrorCall = false

              }
          }
          else{           
            this.isLoadingEditSpecificParameters = false
            this.hasError = true
          }
          

      } catch (error) {
          this.isLoadingEditSpecificParameters = false
          console.log('ERROR', error)
          this.hasErrorCall = true
        
      }


    },
    //props.row.specific_parameters_template, props.row.specific_parameters,props.row.token_parameters,props.row.tokens,props.row.base_url,props.row.url_endpoint
    settingSpecificParameters(id_sensor_endpoint,id_online_sensor,specific_parameters_template_string,specific_parameters_string,token_parameters_string,tokens_string,base_url,url_endpoint, dynamic_url,name_sensor_endpoint_string){
      //Parsing string to JSON
      this.id_sensor_endpoint_edit = id_sensor_endpoint
      this.id_online_sensor_edit = id_online_sensor
      this.specific_parameters_template_edit = JSON.parse(specific_parameters_template_string)
      this.specific_parameters_edit = JSON.parse(specific_parameters_string)
      this.token_parameters_edit = JSON.parse(token_parameters_string)
      this.tokens_edit = JSON.parse(tokens_string)  
      this.base_url_edit = base_url
      this.url_endpoint_edit = url_endpoint 
      this.dynamic_url_edit = dynamic_url 
      this.name_sensor_endpoint_edit = name_sensor_endpoint_string

      console.log(this.specific_parameters_template_edit)
      console.log(this.specific_parameters_edit)
      console.log(this.token_parameters_edit)
      console.log(this.tokens_edit)
      console.log(this.base_url_edit)
      console.log(this.url_endpoint_edit)
      console.log(this.dynamic_url_edit)


      this.editionModalTotalCount = this.specific_parameters_template_edit.parameters.length
      this.editionModalActual = 0
      //Setting up first modal
      this.editMessage = this.specific_parameters_template_edit.parameters[this.editionModalActual].instruction
      this.search_param = this.specific_parameters_template_edit.parameters[this.editionModalActual].search_data.search_param 
      for (let index = 0; index < this.editionModalTotalCount; index++) {
        this.retrieve_params.push({})
        this.retrieve_names.push('')        
      }
 
      this.editSpecificParametersActive = true

    },
    viewSpecificParameters(specific_parameters_string,specific_parameters_template_string,name_sensor_endpoint_string){
      console.log(specific_parameters_template_string)
      console.log(specific_parameters_string)
      this.specific_parameters_view = JSON.parse(specific_parameters_string).actual_data
            console.log(this.specific_parameters_view)

      this.specific_parameters_template_view = JSON.parse(specific_parameters_template_string).parameters

      this.name_sensor_endpoint_view = name_sensor_endpoint_string
      console.log(this.specific_parameters_template_view)
      let index = 0
      console.log(this.specific_parameters_view)
      for (const field of this.specific_parameters_view) {
          console.log(this.specific_parameters_template_view[index])
          field.message = this.specific_parameters_template_view[index].retrieve_message
          index++
      }

      this.viewSpecificParametersActive = true
    },
    viewCapturedParameters(watch_parameters_string,name_sensor_endpoint_string){

      this.name_sensor_endpoint_view = name_sensor_endpoint_string
      let watch_parameters = JSON.parse(watch_parameters_string)
      console.log(watch_parameters)
      this.watch_parameters_captured = watch_parameters.descriptions
      console.log(this.watch_parameters_captured)
      this.viewCapturedParametersActive = true
    },
   
    formatting(){
     for (const sensor_endpoint of this.local_sensor_endpoints) {
       if(sensor_endpoint.activated === 1 || sensor_endpoint.activated === true){
        sensor_endpoint.activated = true
       }
       else{
        sensor_endpoint.activated = false
       }
     }
      
    },
    confirmCustomDelete() {
        this.$buefy.dialog.confirm({
            title: 'Deleting account',
            message: 'Are you sure you want to <b>delete</b> your account? This action cannot be undone.',
            confirmText: 'Si',
            type: 'is-warning',
            hasIcon: true,
            onConfirm: () => this.$buefy.toast.open('Account deleted!')
        })
    },

    loadingData(){
      console.log('pase')
      console.log(this.local_sensor_endpoints)

      this.isLoading = true
        if (this.local_sensor_endpoints.length > this.perPage) {
          this.paginated = true
        }
        this.formatting()
        this.isLoading = false
        this.loaded = true
   
    }
  }
}
</script>
