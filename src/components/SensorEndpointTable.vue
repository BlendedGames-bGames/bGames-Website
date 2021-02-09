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
      :data="sensor_endpoints"
    >
      
      <b-table-column label="Nombre" field="name_sensor_endpoint" sortable v-slot="props">
        {{ props.row.name_sensor_endpoint }}
      </b-table-column>
      <b-table-column label="Descripcion" field="description" sortable v-slot="props">
        {{ props.row.description }}
      </b-table-column>
      <b-table-column label="Parametros capturados" field="watch_parameters" v-slot="props">
          <b-button  icon-left="magnify-plus" native-type="submit" rounded type="is-info" @click="viewCapturedParameters(props.row.watch_parameters)">
                              
          </b-button>     
      </b-table-column>
      <b-table-column label="Parametros especificos" field="schedule_time"  v-slot="props">
        <b-button :disabled="!props.row.specific_parameters" icon-left="magnify-plus" native-type="submit" rounded type="is-info" 
        @click="viewSpecificParameters(props.row.specific_parameters, props.row.name_sensor_endpoint)">
                              
        </b-button>   

           <b-button :disabled="!props.row.specific_parameters" icon-left="pencil" native-type="submit" rounded type="is-success" 
           @click="settingSpecificParameters(props.row.specific_parameters_template, props.row.specific_parameters,props.row.token_parameters,props.row.tokens,props.row.base_url,props.row.url_endpoint)">
                              
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
                          <p class="modal-card-title">Login</p>
                          <button
                              type="button"
                              class="delete"
                              @click="viewCapturedParametersActive = false"/>
                      </header>
                      <section class="modal-card-body">
                          <b-field label="Email">
                              <b-input
                                  type="email"
                                  :value="email"
                                  placeholder="Your email"
                                  required>
                              </b-input>
                          </b-field>

                          <b-field label="Password">
                              <b-input
                                  type="password"
                                  :value="password"
                                  password-reveal
                                  placeholder="Your password"
                                  required>
                              </b-input>
                          </b-field>
                      </section>
                  </div>
              </form>
        </b-modal>
     <b-modal v-model="editSpecificParametersActive" :width="640" scroll="keep">
                <form action="">
                  <div class="modal-card" style="width: auto">
                      <header class="modal-card-head">
                          <p class="modal-card-title">Login</p>
                          <button
                              type="button"
                              class="delete"
                              @click="editSpecificParametersActive = false"/>
                      </header>
                      <section class="modal-card-body">
                          <b-field label="Email">
                              <b-input
                                  type="email"
                                  :value="email"
                                  placeholder="Your email"
                                  required>
                              </b-input>
                          </b-field>

                          <b-field label="Password">
                              <b-input
                                  type="password"
                                  :value="password"
                                  password-reveal
                                  placeholder="Your password"
                                  required>
                              </b-input>
                          </b-field>

                          <b-checkbox>Remember me</b-checkbox>
                      </section>
                      <footer class="modal-card-foot">
                          <b-button
                              label="Close"
                              @click="editSpecificParametersActive = false" />
                          <b-button
                              label="Login"
                              type="is-primary" />
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
import { mapGetters } from 'vuex'
import {baseURL, getPort} from '../store/urls'

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
      getURL:baseURL+getPort,
      loaded:false,
      viewSpecificParametersActive: false,
      editSpecificParametersActive: false,
      viewCapturedParametersActive: false,
      email:'',
      password:'',
      name_sensor_endpoint_view:'',
      specific_parameters_view: ''

    }
  },
  watch: {
    // whenever question changes, this function will run
    sensor_endpoints: function (newSensor, oldSensor) {
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
    this.loadingData()
  },
  methods: {
    //props.row.specific_parameters_template, props.row.specific_parameters,props.row.token_parameters,props.row.tokens,props.row.base_url,props.row.url_endpoint
    settingSpecificParameters(specific_parameters_template_string,specific_parameters_string,token_parameters_string,tokens_string,base_url,url_endpoint){
      let specific_parameters_template = JSON.parse(specific_parameters_template_string)
      let specific_parameters = JSON.parse(specific_parameters_string)
      let token_parameters = JSON.parse(token_parameters_string)
      let tokens = JSON.parse(tokens_string)  

      console.log(specific_parameters_template)
      console.log(specific_parameters)
      console.log(token_parameters)
      console.log(tokens)
      console.log(base_url)
      console.log(url_endpoint)
      this.editSpecificParametersActive = true

    },
    viewSpecificParameters(specific_parameters_string,name_sensor_endpoint_string){
      this.specific_parameters_view = JSON.parse(specific_parameters_string).actual_data
      this.name_sensor_endpoint_view = name_sensor_endpoint_string
      console.log(this.specific_parameters_view)

      this.viewSpecificParametersActive = true
    },
    viewCapturedParameters(watch_parameters_string){
      let watch_parameters = JSON.parse(watch_parameters_string)
      console.log(watch_parameters)
      this.viewCapturedParametersActive = true
    },
   
    formatting(){
     for (const sensor_endpoint of this.sensor_endpoints) {
       if(sensor_endpoint.activated === 1 || sensor_endpoint.activated === true){
        sensor_endpoint.activated = true
       }
       else{
        sensor_endpoint.activated = false
       }
     }
      
    },

    loadingData(){
      console.log('pase')
      console.log(this.sensor_endpoints)

      this.isLoading = true
        if (this.sensor_endpoints.length > this.perPage) {
          this.paginated = true
        }
        this.formatting()
        this.isLoading = false
        this.loaded = true
   
    }
  }
}
</script>
