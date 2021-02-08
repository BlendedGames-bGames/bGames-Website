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
      <b-table-column label="Subatributo" field="name_subattributes" sortable v-slot="props">
        {{ props.row.name_subattributes }}
      </b-table-column>
      <b-table-column label="Dato" field="data" sortable v-slot="props">
        {{ props.row.data }}
      </b-table-column>
      <b-table-column label="Obtenido fecha" centered v-slot="props">
        <span class="tag is-success">
                    {{ new Date(props.row.created_time).toString() }}
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
    adquired_subattribute_rt: {
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
    adquired_subattribute_rt: function(newVal, oldVal) { // watch it
        console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        var new_data = this.formattingSubatt(newVal)
        this.addingData(new_data)
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
  async mounted () {
    await this.loadingData()    
    console.log(this.userLevels)
    console.log(this.sensorsAndEndpoints)
  },
  methods: {
    addingData(new_data){
      this.isLoading = true
      new_data.forEach(data => {
          this.table_data.unshift(data)
      });
      this.isLoading = false
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
        subatts.forEach(subatt => {
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
        console.log(subatts)
        return subatts

      
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
      const MEDIUM_GET_URL = this.getURL+'/id_player/'+this.id_player.toString()+'/adquired_subattributes_list'
      try {
            const subatts = await Axios.get(MEDIUM_GET_URL);
            this.table_data = subatts.data
            console.log(this.table_data)
             if (this.table_data .length > this.perPage) {
              this.paginated = true
            }
            this.isLoading = false
            this.loaded = true
      } catch (error) {
          this.$buefy.toast.open({
            message: `Error: ${e.message}`,
            type: 'is-danger'
          })
      }
   
    }
  }
}
</script>
