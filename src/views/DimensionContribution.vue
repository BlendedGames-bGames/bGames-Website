<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar :has-right-visible="false">
      Contribudores a dimensiones y puntos de datos
    </hero-bar>
    <section class="section is-main-section">
          <card-component
          >
                <div class="columns is-flex">

                    <div class="column is-3">     
                      <select-component label="Dimension" 
                                        placeholder="Seleciona una dimension"  
                                        :selectOptions="name_dimensions" 
                                        @selected-option-click="treemapQueryDimension"
                      /> 
                     
                      <select-component label="Dimension" 
                                        placeholder="Seleciona una dimension"  
                                        :selectOptions="name_dimensions" 
                                        @selected-field-click="chosen_dimension"
                                        @selected-option-click="treemapQueryDimensionAndSubatt"
                      >
                          <b-field  vertical
                                    label="Subatributo" style="margin-bottom: 1em">
                            <b-select
                                v-model="selectedOption"
                                placeholder="Selecciona un subatributo"
                                @input="selectedOptionClick"
                                required
                              >
                                <option
                                  v-for="(option, index) in subattributes"
                                  :key="index"
                                  :value="option"
                                >
                                  {{ option }}
                                </option>
                            </b-select>  
                          </b-field>
                      </select-component>

                             
                    </div>
                    <div class="column is-9">
                          <apexchart v-if="treeMapShow" height="350"  type="treemap" :options="chartOptions" :series="series"></apexchart>

                    </div>
                </div>

          </card-component>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import * as chartConfig from '@/components/Charts/chart.config'
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
import Tiles from '@/components/Tiles'
import CardWidget from '@/components/CardWidget'
import CardComponent from '@/components/CardComponent'
import LineChart from '@/components/Charts/LineChart'
import ClientsTableSample from '@/components/ClientsTableSample'
import VueApexCharts from 'vue-apexcharts'
import SelectComponent from '../components/SelectComponent.vue'
import { mapGetters } from 'vuex'
import {baseURL, getPort} from '../store/urls'
import Axios from 'axios'

export default {
  name: 'DimensionContribution',
  components: {
    ClientsTableSample,
    LineChart,
    CardWidget,
    Tiles,
    HeroBar,
    TitleBar,
    apexchart: VueApexCharts,
    SelectComponent,
    CardComponent

  },
  data () {
    return {
      chosen_dimension_option: null,
      chosen_subatt_option: null,
      selectedOption:null,
      treeMapShow:false,
      getURL:baseURL+getPort,
      subattributes: [],
      series: [
            {
              name: 'Desktops',
              data: [
                {
                  x: 'ABC',
                  y: 10
                },
                {
                  x: 'DEF',
                  y: 60
                },
                {
                  x: 'XYZ',
                  y: 41
                }
              ]
            },
            {
              name: 'Mobile',
              data: [
                {
                  x: 'ABCD',
                  y: 10
                },
                {
                  x: 'DEFG',
                  y: 20
                },
                {
                  x: 'WXYZ',
                  y: 51
                },
                {
                  x: 'PQR',
                  y: 30
                },
                {
                  x: 'MNO',
                  y: 20
                },
                {
                  x: 'CDE',
                  y: 30
                }
              ]
            }
      ],
      chartOptions: {
            legend: {
              show: true,
              showForSingleSeries:true,
               formatter: function(seriesName, opts) {
                  console.log()
                  let total = opts.w.globals.series[opts.seriesIndex].reduce((a, b) => a + b, 0)
                  return [seriesName, " - ", total]
                }
            },
            chart: {
              height: 350,
              type: 'treemap'
            },
            title: {
              text: 'Contribucion de sensores',
              align: 'center'
            }
      }          
    }
  },
  computed: {
    titleStack () {
      return ['Admin', 'Dashboard']
    },
     ...mapGetters('attribute', {
          name_dimensions: 'name_dimensions',
          id_dimensions: 'id_dimensions',
          dimensionsAndSubattributes: 'dimensionsAndSubattributes',
    }),
    ...mapGetters('user', {
          userLevels: 'userLevels',
          id_player: 'id_player'

    }),
  },
  mounted () {

    this.$buefy.snackbar.open({
      message: 'Welcome back',
      queue: false
    })
  },
  methods: {
    async treemapQueryDimension(option){
      this.treeMapShow = false
      let id_dimension;

      if(!option) return

      this.dimensionsAndSubattributes.forEach((dimension,index) => {
        if(dimension.name === option){
          id_dimension = dimension.id_attributes
        }
      });
      ///attributes/:id_attributes/sensor_contribution
      console.log(id_dimension)
      const MEDIUM_GET_URL = this.getURL+'/player/'+this.id_player.toString()+'/attributes/'+id_dimension.toString()+'/sensor_endpoint_contribution'
      const sensor_contribution = await Axios.get(MEDIUM_GET_URL);
      console.log(sensor_contribution)
      this.series=sensor_contribution.data
      this.chartOptions= {
            legend: {
              show: true,
              showForSingleSeries:true,
               formatter: function(seriesName, opts) {
                  console.log()
                  let total = opts.w.globals.series[opts.seriesIndex].reduce((a, b) => a + b, 0)
                  return [seriesName, " - ", total]
                }
            },
            chart: {
              height: 350,
              type: 'treemap'
            },
            title: {
              text: `Contribucion de los sensores y puntos de datos asociados a la dimension ${option}`,
              align: 'center'
            }
          }
      this.treeMapShow = true
      
    },
    async treemapQueryDimensionAndSubatt(option){
      console.log(option)
      this.treeMapShow = false
      if(!this.chosen_dimension_option || !this.chosen_subatt_option) return
      ///player/:id_player/attributes/:id_attributes/subattributes/:id_subattributes/sensor_contribution
      const MEDIUM_GET_URL = this.getURL+'/player/'+this.id_player.toString()+'/attributes/'+this.chosen_dimension_option.toString()+'/subattributes/'+this.chosen_subatt_option.toString()+'/sensor_endpoint_contribution'
      const sensor_contribution = await Axios.get(MEDIUM_GET_URL);
      console.log(sensor_contribution)
      this.series=sensor_contribution.data
      this.chartOptions= {
            legend: {
              show: true,
              showForSingleSeries:true,
               formatter: function(seriesName, opts) {
                  console.log()
                  let total = opts.w.globals.series[opts.seriesIndex].reduce((a, b) => a + b, 0)
                  return [seriesName, " - ", total]
                }
            },
            chart: {
              height: 350,
              type: 'treemap'
            },
            title: {
              text: `Contribucion de los sensores y puntos de datos asociados al subatributo ${this.selectedOption}`,
              align: 'center'
            }
          }
      this.treeMapShow = true
    },
    selectedOptionClick(){
      console.log(this.selectedOption)
      this.dimensionsAndSubattributes.forEach((dimension,index) => {
        dimension.subattributes.forEach( subatt=> {
          if(subatt.name ===  this.selectedOption){
            this.chosen_subatt_option = subatt.id_subattributes 
          }
        });
      });
      console.log(this.chosen_subatt_option)
    },
    chosen_dimension(selected){
      this.dimensionsAndSubattributes.forEach((dimension,index) => {
        if(dimension.name === selected){
          this.chosen_dimension_option = dimension.id_attributes 
        }
      });
      console.log(this.chosen_dimension_option)
      let correspond_subatts;
      this.dimensionsAndSubattributes.forEach((dimension,index) => {
        if(dimension.name === selected){
          correspond_subatts = dimension.subattributes 
        }
      });
      let subatts_names = []
      correspond_subatts.forEach(subatt => {
        subatts_names.push(subatt.name)
      });
      this.subattributes = subatts_names
    }
  }
}
</script>
