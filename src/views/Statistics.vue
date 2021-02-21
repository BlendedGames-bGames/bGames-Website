<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar :has-right-visible="false">
      Estadisticas generales
    </hero-bar>
    <section class="section is-main-section">       
      <div class="columns" >
          <div v-if="chartRadarLoading" class="chart-area column is-6">
            <card-component
              title="Dimensiones"
              icon="finance"
            >
              <apexchart type="radar"  height="auto" width='100%' :options="chartOptions" :series="series"></apexchart>

          
            </card-component>

            
          </div>
          <div  class="chart-area  column is-6">
             <card-component
              title="Sub-atributos"
              icon="finance"
              select
              placeholder="Selecciona una dimension"
              :selectOptions="name_dimensions"
              @selected-option-click="selectedOptionBarChartClick"
            >
              <apexchart type="bar" v-if="chartBarLoading"  height="auto" width='100%' :options="options" :series="series2"></apexchart>

            </card-component>
            
          </div>

      </div>
       <b-tabs type="is-boxed" v-model="activeTab">
            <b-tab-item label="Registro de subatributos adquiridos">
                <card-component
                      class="has-table has-mobile-sort-spaced"
                      icon="account-multiple"
                >
                  <data-endpoint-table
                    :data_table_type="'Adquired'"
                    :checkable="false"
                    :real_time_data="adquired_subattribute_rt"
                  />
                </card-component>
          </b-tab-item>

            <b-tab-item label="Registro de atributos gastados">
                <card-component
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
                >
                  <data-endpoint-table
                    :data_table_type="'Expended'"
                    :checkable="false"
                    :real_time_data="expended_attribute_rt"
                  />
               </card-component>
            </b-tab-item>
       </b-tabs>
      
        
    
        
      
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
import CardComponent from '@/components/CardComponent'
import VueApexCharts from 'vue-apexcharts'
import DataEndpointTable from '@/components/DataEndpointTable'

import { mapGetters, mapActions } from 'vuex'
import {baseURL, getPort} from '../store/urls'
export default {
  name: 'Statistics',
  components: {
    CardComponent,
    HeroBar,
    TitleBar,
    apexchart: VueApexCharts,
    DataEndpointTable
  },
  data () {
    return {
      id_actualChosenDimensionBar: null,
      departments: ['Business Development', 'Marketing', 'Sales'],
      chartRadarLoading:false,
      chartBarLoading:false,
      getURL:baseURL+getPort,
      adquired_subattribute_rt:null,
      expended_attribute_rt:null,
      activeTab: 0,

      series: [{
            name: '',
            /*data: [80, 50, 30, 40, 100, 20],*/
            data: []
      }],
      chartOptions: {
          chart: {
              height: '100%',
              type: 'radar',
            },
            xaxis: {
              /*categories: ['January', 'February', 'March', 'April', 'May', 'June']*/
              categories: []
            }
      },
      series2: [{
            //data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
            data:[]
      }],
      options: {
        chart: {
          type: 'bar',
          height: '100%'
        },
        plotOptions: {
          bar: {
            barHeight: '100%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom'
            },
          }
        },
        colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
          '#f48024', '#69d2e7'],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#fff']
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          //categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'India' ],
          categories: []
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        title: {
            text: 'Custom DataLabels',
            align: 'center',
            floating: true
        },
        subtitle: {
            text: 'Category Names as DataLabels inside bars',
            align: 'center',
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function () {
                return ''
              }
            }
          }
        }
      }
    }
  },
  computed: {
    titleStack () {
      return ['Admin', 'Dashboard']
    },
    ...mapGetters('user', {
          userDimensionLevels: 'userDimensionLevels',
          userLevels: 'userLevels',
          id_player: 'id_player',
          dimensionSocket: 'dimensionSocket'

    }),
    ...mapGetters('attribute', {
          name_dimensions: 'name_dimensions',
          id_dimensions: 'id_dimensions',
    }),
  },
  mounted () {
    console.log('hola')
    this.fillChartRadar()
    this.listen();

    this.$buefy.snackbar.open({
      message: 'Welcome back',
      queue: false
    })
  },
  methods: {
    ...mapActions('user',{
      setRealTimeDimensionLevels: 'setRealTimeDimensionLevels',
      setRealTimeSubattributeLevels: 'setRealTimeSubattributeLevels'
    }),
    settingNewDimensions(attribute){
      let realData = this.series[0].data
      attribute.id_attributes.forEach( (id_attribute,index) => {
          this.id_dimensions.forEach((level,index2) => {
            if(level === id_attribute){
              realData[index2] = attribute.data[index]
            }
          });
      })
      this.series = [{
        data:realData
      }]
    },
    settingNewSubattributes(subattribute){
      let changedDimensions = []
      console.log(this.id_actualChosenDimensionBar)
      subattribute.id_subattributes.forEach( (id_subattribute,index) => {
          this.userLevels.forEach((level,index2) => {
            level.subattribute_levels.forEach((dimension_subattributes,index) => {
              if(dimension_subattributes.id_subattributes === id_subattribute){
                changedDimensions.push(dimension_subattributes.id_attributes)
              }
            });
            
          });
      })
      if(changedDimensions.includes(this.id_actualChosenDimensionBar)){
        //Se actualizo uno o mas subatributo que estan en pantalla en el chart de barras
        let boolArray = []
        for (const possibleDimension of changedDimensions) {
          if(possibleDimension === this.id_actualChosenDimensionBar){
            boolArray.push(1)
          }
          else{
            boolArray.push(0)
          }
        }
        let actualSubattributes = this.series2[0].data
        console.log(actualSubattributes)
        console.log(boolArray)
        console.log(subattribute.data)
        boolArray.forEach((bool,index) => {
          if(bool){
            actualSubattributes[index] += subattribute.data[index]
          }
        });
        this.series2 = [{ data:actualSubattributes }]
      }
    },
		listen: function () {		
      /*Input: attribute = {id_attributes: [], data: []}, ids de dimensiones y los datos nuevos actualizados desde el post att microservicio*/
      this.dimensionSocket.on('player_attribute', attribute => {
        console.log('aqui')
        console.log(attribute)
        this.settingNewDimensions(attribute)
        this.setRealTimeDimensionLevels(attribute)
      });
      this.dimensionSocket.on('player_expended_attribute', attribute => {
        console.log('aqui')
        console.log(attribute)
        this.expended_attribute_rt = attribute
      });
      /*Input: subattribute = {id_subattributes: [], data: []}, ids de subatributos y los datos nuevos actualizados desde el post att microservicio*/
      this.dimensionSocket.on('player_adquired_subattribute', subattribute => {
        console.log('aqui')
        console.log(subattribute)
        this.adquired_subattribute_rt = subattribute
        console.log(this.id_actualChosenDimensionBar)
        if(this.id_actualChosenDimensionBar){
          this.settingNewSubattributes(subattribute)
        }
        this.setRealTimeSubattributeLevels(subattribute)
        
      });
		},
    selectedOptionBarChartClick(selectedOption){
      console.log(selectedOption)
      this.fillChartBar(selectedOption)
    },   
    async fillChartRadar(){
      console.log(this.userDimensionLevels)
      console.log(this.name_dimensions)
      this.series[0].data = this.userDimensionLevels
      this.chartOptions.xaxis.categories = this.name_dimensions
      this.chartRadarLoading = true
    },
    async fillChartBar(selectedOption){
      this.chartBarLoading = false
      let chosenSubattributes;
      for (const dimension of this.userLevels) {
        if(dimension.name === selectedOption){
          chosenSubattributes = dimension.subattribute_levels
          this.id_actualChosenDimensionBar = dimension.id_attributes
          break
        }        
      }
      let name_subattributes = []
      let data_subattributes = []
      for (const subattribute of chosenSubattributes) {
        name_subattributes.push(subattribute.name_subattributes)
        data_subattributes.push(subattribute.total)
      }
      console.log(data_subattributes)
      console.log(typeof(data_subattributes[0]))
      console.log(name_subattributes)
      this.series2 = [{ data:data_subattributes }],
      this.options = {
        chart: {
          type: 'bar',
          height: '100%'
        },
        plotOptions: {
          bar: {
            barHeight: '100%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom'
            },
          }
        },
        colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
          '#f48024', '#69d2e7'],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#fff']
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          //categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'India' ],
          categories: name_subattributes
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        title: {
            text: `Composicion de la dimension ${selectedOption} en subatributos`,
            align: 'center',
            floating: true
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function () {
                return ''
              }
            }
          }
        }
      }
      this.chartBarLoading = true
    }
  }
}
</script>
