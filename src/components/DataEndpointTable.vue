<template>
  <div>
    <div v-if="this.data_table_type === 'Adquired'">
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
          :data="table_data"
        >
        
              <b-table-column label="Sensor" field="name_online_sensor" sortable v-slot="props">
                {{ props.row.name_online_sensor }}
              </b-table-column>
              <b-table-column label="Punto de datos" field="name_sensor_endpoint" sortable v-slot="props">
                {{ props.row.name_sensor_endpoint }}
              </b-table-column>
              <b-table-column label="Descripcion" field="description" v-slot="props">
                {{ props.row.description }}
              </b-table-column>
              <b-table-column label="Dimension" field="name_dimension" sortable v-slot="props">
                {{ props.row.name_dimension }}
              </b-table-column>
              <b-table-column label="Atributo" field="name_subattributes" sortable v-slot="props">
                {{ props.row.name_subattributes }}
              </b-table-column>
              <b-table-column label="Puntaje" field="data" sortable v-slot="props">
                {{ props.row.data }}
              </b-table-column>
              <b-table-column label="Fecha de obtencion" centered v-slot="props">
                <span class="tag is-success">
                            {{ new Date(props.row.created_time).toLocaleString() }}
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
    </div>
    <div v-else-if="this.data_table_type === 'Expended'">
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
            :data="table_data"
          >
          
          
                <b-table-column label="Videojuego" field="name_videogame" sortable v-slot="props">
                  {{ props.row.name_videogame }}
                </b-table-column>
                <b-table-column label="Mecanica modificada" field="name_modifiable_mechanic" sortable v-slot="props">
                  {{ props.row.name_modifiable_mechanic }}
                </b-table-column>
                <b-table-column label="Descripcion" field="description" v-slot="props">
                  {{ props.row.description }}
                </b-table-column>
                <b-table-column label="Dimension" field="name_dimension" sortable v-slot="props">
                  {{ props.row.name_dimension }}
                </b-table-column>
                <b-table-column label="Puntaje" field="data" sortable v-slot="props">
                  {{ props.row.data }}
                </b-table-column>
                <b-table-column label="Fecha de consumo" centered v-slot="props">
                  <span class="tag is-success">
                              {{ new Date(props.row.created_time).toLocaleString() }}
                  </span>
                </b-table-column>

          </b-table>

    </div>
  
  </div>
</template>

<script>
import Axios from 'axios'
import ModalBox from '@/components/ModalBox'
import { mapGetters } from 'vuex'
import {baseURL, getPort} from '../store/urls'

export default {
  name: 'DataEndpointTable',
  components: { ModalBox },
  props: {
    checkable: {
      type: Boolean,
      default: false
    },
    data_table_type: {
      type: String,
      default: ''
    },
    real_time_data: {
      type:Array,
      default:[]
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
      loaded:false
    }
  },
  watch: { 
    real_time_data: function(newVal, oldVal) { // watch it
        console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        var new_data;
                    console.log('paso por aqui -1')
        console.log('paso por aqui')
        if(this.data_table_type === 'Adquired'){
            new_data = this.formattingSubatt(newVal)
        }
        else if(this.data_table_type === 'Expended'){
            console.log('paso por aqui x2')
            new_data = this.formattingVideogameMechanic(newVal)
        }
        this.addingData(new_data)
    }
  },
  computed: {
     ...mapGetters('user', {
          userLevels: 'userLevels',
          id_player: 'id_player'
    }),
    ...mapGetters('sensor', {
          sensorsAndEndpoints: 'sensorsAndEndpoints'
    }),
    ...mapGetters('videogame', {
          videogamesAndModifiableMechanics: 'videogamesAndModifiableMechanics'
    }),
  },
  async mounted () {
    await this.loadingData()    
    console.log(this.userLevels)
    console.log(this.sensorsAndEndpoints)
    console.log(this.videogamesAndModifiableMechanics)
  },
  methods: {
    addingData(new_data){
      this.isLoading = true
      new_data.forEach(data => {
          this.table_data.unshift(data)
      });
      this.isLoading = false
    },
    formattingVideogameMechanic(videogame_data){
      //id_attributes:id_attributes[i], data:new_data[i], id_videogame:id_videogame, id_modifiable_mechanic:id_modifiable_mechanic, created_time:date}
      console.log('no hay error -1')
      videogame_data.forEach(singleData => {
        //videogamesAndModifiableMechanics
        console.log('no hay error 0')
        console.log(this.videogamesAndModifiableMechanics)
        for (const videogame of this.videogamesAndModifiableMechanics) {
            if(videogame.id_videogame === singleData.id_videogame){
              let videogame_variable = this.searchOnArrayOption(videogame.modifiable_mechanics,'id_modifiable_mechanic',singleData.id_modifiable_mechanic,['name_videogame','name_modifiable_mechanic','description'])
              console.log(videogame_variable)
              if(videogame_variable !== undefined && videogame_variable.length !== 0){
                  for (const variable of videogame_variable) {
                        singleData[variable.name] = variable.data
                  }
                  break
              }
            }
        }
        console.log('no hay error')
            console.log(this.userLevels)

        let dimension_variables = this.searchOnArrayOption(this.userLevels,'id_attributes',singleData.id_attributes,'name')
        if(dimension_variables !== undefined){
            singleData['name_dimension'] = dimension_variables
        }   
        console.log(dimension_variables)           
        console.log('no hay error x2')

        
      });
      console.log('resultado')
      console.log(videogame_data)
      return videogame_data


    },
    formattingSubatt(subatts){
      //results.push({id_subattributes:id_subattributes[i], data:new_data[i], id_sensor_endpoint:id_sensor_endpoint, created_time:date})
      /*created_time: (...)
        data: (...)
        description: (...)
        id_attributes: (...)
        id_online_sensor: (...)
        id_sensor_endpoint: (...)
        id_subattributes: (...)
        name_dimension: (...)
        name_online_sensor: (...)
        name_sensor_endpoint: (...)
        name_subattributes: (...) 
      */    
      let auxSubatt = []
      subatts.forEach(subatt => {
        let aux = subatt
        aux.id_subattributes = parseInt(aux.id_subattributes)
        aux.id_sensor_endpoint = parseInt(aux.id_sensor_endpoint)
        auxSubatt.push(aux)
      });
        auxSubatt.forEach(subatt => {
          this.userLevels.forEach(dimension => {
            let dimension_variables = this.searchOnArrayOption(dimension.subattribute_levels,'id_subattributes',subatt.id_subattributes,['name_subattributes','name_dimension','id_attributes'])
            if(dimension_variables !== undefined && dimension_variables.length !== 0){
              for (const variable of dimension_variables) {
                    subatt[variable.name] = variable.data
              }
            }
          });
          this.sensorsAndEndpoints.forEach(sensor => {
            let sensor_variables = this.searchOnArrayOption(sensor.endpoints,'id_sensor_endpoint',subatt.id_sensor_endpoint,['name_sensor_endpoint','id_online_sensor','description','name_online_sensor'])
            if(sensor_variables !== undefined && sensor_variables.length !== 0){
              for (const variable of sensor_variables) {
                    subatt[variable.name] = variable.data
              }
            }
          });
        });
        console.log('resultado')
        console.log(auxSubatt)
        return auxSubatt

      
    },
    searchOnArrayOption(arrayToSearch,attArray,option,attSingle){
      let result = []
      arrayToSearch.forEach((element) => {
          if(element[attArray] === option){       
            if(Array.isArray(attSingle)){
                for (const variable of attSingle) {
                  result.push({name:variable,data:element[variable]})
                }
            }
            else{
              result = element[attSingle]             

            }
          }
      });
      return result
    },

    async loadingData(){
      this.isLoading = true
      let MEDIUM_GET_URL;
      if(this.data_table_type === 'Adquired'){
        MEDIUM_GET_URL =  this.getURL+'/id_player/'+this.id_player.toString()+'/adquired_subattributes_list'
      }
      else if(this.data_table_type === 'Expended'){
        MEDIUM_GET_URL =  this.getURL+'/id_player/'+this.id_player.toString()+'/expended_attributes_list'
      }
      try {
            console.log(this.table_data)
            console.log(MEDIUM_GET_URL)
            const atts = await Axios.get(MEDIUM_GET_URL);
            console.log(atts)
            console.log(atts.data)
            this.table_data = atts.data
            console.log(this.table_data)
             if (this.table_data.length > this.perPage) {
              this.paginated = true
            }
            console.log(this.table_data)
            this.isLoading = false
            this.loaded = true
      } catch (error) {
          this.$buefy.toast.open({
            message: `Error:`,
            type: 'is-danger'
          })
      }
   
    }
  }
}
</script>
