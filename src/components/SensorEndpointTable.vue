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
        {{ props.row.description }}
      </b-table-column>
      <b-table-column label="Parametros especificos" field="schedule_time"  v-slot="props">
           <b-button :disabled="!props.row.specific_parameters" icon-left="pencil" native-type="submit" rounded type="is-success" @click="console.log('dasasd')">
                              
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
      loaded:false
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
