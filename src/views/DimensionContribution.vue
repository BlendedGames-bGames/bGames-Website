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
                                        :selectOptions="departments" 
                                        @selected-option-click="selectedOptionDimension1"
                      /> 
                     
                      <select-component label="Dimension" 
                                        placeholder="Seleciona una dimension"  
                                        :selectOptions="departments" 
                                        @selected-option-click="selectedOptionDimension2"
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
                                  v-for="(option, index) in departments"
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
                          <apexchart type="treemap" :options="chartOptions" :series="series"></apexchart>

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
      selectedOption: null,
      departments: ['Business Development', 'Marketing', 'Sales'],
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
              show: true
            },
            chart: {
              height: '70%',
              type: 'treemap'
            }
          },

    }
  },
  computed: {
    titleStack () {
      return ['Admin', 'Dashboard']
    }
  },
  mounted () {

    this.$buefy.snackbar.open({
      message: 'Welcome back',
      queue: false
    })
  },
  methods: {
    selectedOptionClick(){

    },
    selectedOptionDimension1(selectedOption){
      console.log(selectedOption)
    },
    selectedOptionDimension2(selectedOption2){
      console.log(selectedOption2)
    },
    randomChartData (n) {
      const data = []

      for (let i = 0; i < n; i++) {
        data.push(Math.round(Math.random() * 200))
      }

      return data
    },
    fillChartData () {
      
    }
  }
}
</script>
