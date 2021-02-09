<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar>
      Puntos de datos
    
    </hero-bar>
    <section class="section is-main-section">

      <card-component
        class="has-table has-mobile-sort-spaced"
        title="Lista de punto de datos"
        label="Sensor"
        icon="account-multiple"
        select
        placeholder="Selecciona un sensor"
        :selectOptions="name_sensors"
        @selected-option-click="selectedSensor"
      >
          <sensor-endpoint-table
              v-if="loaded"
              :checkable="false"
              :sensor_endpoints="sensor_endpoints"
            />
      </card-component>
    </section>
  </div>
</template>

<script>
import Notification from '@/components/Notification'
import CardComponent from '@/components/CardComponent'
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
import SensorEndpointTable from '@/components/SensorEndpointTable'
import { mapGetters } from 'vuex'

export default {
  name: 'DataEndpoint',
  components: {
    HeroBar,
    TitleBar,
    CardComponent,
    SensorEndpointTable,
    Notification
  },
  data () {
    return {
      departments: ['Business Development', 'Marketing', 'Sales'],
      loaded: false,
      sensor_endpoints:null
      
    }
  },
  computed: {
    titleStack () {
      return ['Admin', 'Tables']
    },
    ...mapGetters('sensor', {
          sensorsAndEndpoints: 'sensorsAndEndpoints',
          name_sensors: 'name_sensors',
          id_sensors: 'id_sensors'
    }),
     ...mapGetters('user', {
          id_player: 'id_player'
    })
  },
  methods: {
     searchOnArrayOption(arrayToSearch,attArray,option,attSingle){
      let result;
      arrayToSearch.forEach((element) => {
          if(element[attArray] === option){        
            result = element[attSingle]             
          }
      });
      return result
    },
    selectedSensor(selectedOption){
      var id_online_sensor = this.searchOnArrayOption(this.sensorsAndEndpoints,'name',selectedOption,'id_online_sensor')
      let correspond_endpoints = this.searchOnArrayOption(this.sensorsAndEndpoints,'id_online_sensor',id_online_sensor,'endpoints')
      console.log(correspond_endpoints) 
      this.sensor_endpoints = correspond_endpoints
      this.loaded = true

    },
  }
}
</script>
