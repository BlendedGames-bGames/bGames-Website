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
      <card-component
        class="has-table has-mobile-sort-spaced"
        title="Registro de subatributos adquiridos"
        icon="account-multiple"
      >
        <data-endpoint-table
          :data-url="`${$router.options.base}data-sources/clients.json`"
          :checkable="true"
        />
      </card-component>
      

      <card-component
        title="Evolucion de dimensiones en el tiempo "
        icon="finance"
        rangeDates
        @query-option-click="selectedDatesLineChartClick"
      >

          <apexchart  v-if="chartLineDimn" type="line" height="350" :options="chartOptions3" :series="series3"></apexchart>
      
      </card-component>



        <card-component
        title="Evolucion de sub-atributos en el tiempo "
        icon="finance"
        select
        placeholder="Selecciona una dimension"
        :selectOptions="name_dimensions"
        rangeDates
        @selected-option-click="selectedOptionLineChartClick"
        @query-option-click="selectedDatesLineChartClick2"
      >
        <apexchart  v-if="chartLineDimn2" type="line" height="350" :options="chartOptions4" :series="series4"></apexchart>
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
import Axios from 'axios'
import DataEndpointTable from '@/components/DataEndpointTable'

import { mapGetters, mapActions } from 'vuex'
import {baseURL, getPort} from '../store/urls'
export default {
  name: 'Statistics',
  components: {
    ClientsTableSample,
    LineChart,
    CardComponent,
    CardWidget,
    Tiles,
    HeroBar,
    TitleBar,
    apexchart: VueApexCharts,
    DataEndpointTable
  },
  data () {
    return {
      id_actualChosenDimensionBar: null,
      id_actualChosenDimensionLine: null,
      departments: ['Business Development', 'Marketing', 'Sales'],
      chartRadarLoading:false,
      chartBarLoading:false,
      chartLineDimn:false,
      chartLineDimn2:false,
      getURL:baseURL+getPort,

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
       
      series3: [{
          name: "Session Duration",
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
        },
        {
          name: "Page Views",
          data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
        },
        {
          name: 'Total Visits',
          data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
        }
      ],
      chartOptions3: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [5, 7, 5],
          curve: 'straight',
          dashArray: [3, 8, 5]
        },
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
            '10 Jan', '11 Jan', '12 Jan'
          ],
        },
        grid: {
          borderColor: '#f1f1f1',
        }
      },
      series4: [{
          name: "Session Duration",
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
        },
        {
          name: "Page Views",
          data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
        },
        {
          name: 'Total Visits',
          data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
        }
      ],
      chartOptions4: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [5, 7, 5],
          curve: 'straight',
          dashArray: [3, 8, 5]
        },
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
            '10 Jan', '11 Jan', '12 Jan'
          ],
        },
        grid: {
          borderColor: '#f1f1f1',
        }
      },          
          
        
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
    this.fillAdquiredSubattributesTable()
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
    async fillAdquiredSubattributesTable(){
      ///id_player/:id_player/attributes/:id_attributes/adquired_subattributes_list
      const MEDIUM_GET_URL = this.getURL+'/id_player/'+this.id_player.toString()+'/adquired_subattributes_list'
      const tabledata = await Axios.get(MEDIUM_GET_URL);
      console.log(tabledata)

    },
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
      /*Input: subattribute = {id_subattributes: [], data: []}, ids de subatributos y los datos nuevos actualizados desde el post att microservicio*/
      this.dimensionSocket.on('player_adquired_subattribute', subattribute => {
        console.log('aqui')
        console.log(subattribute)
        this.settingNewSubattributes(subattribute)
        this.setRealTimeSubattributeLevels(subattribute)
      });
		},
    selectedOptionBarChartClick(selectedOption){
      console.log(selectedOption)
      this.fillChartBar(selectedOption)
    },
    selectedDatesLineChartClick(selectedOption){
      console.log(selectedOption)
      this.fillChartLineDimn(selectedOption)

    },
    selectedOptionLineChartClick(selectedOption){
      console.log(selectedOption)
      
      for (const dimension of this.userLevels) {
        if(dimension.name === selectedOption){
          this.id_actualChosenDimensionLine = dimension.id_attributes
          break
        }
      }

    },
    selectedDatesLineChartClick2(selectedOption){
      console.log(selectedOption)
      if(this.id_actualChosenDimensionLine !== null){
        this.fillChartLineDimn2(selectedOption)
      }

    },
    randomChartData (n) {
      const data = []

      for (let i = 0; i < n; i++) {
        data.push(Math.round(Math.random() * 200))
      }

      return data
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
    },
    dateTransformation(dates){
      let from_time = dates.from_time
      let to_time = dates.to_time
      console.log(from_time)
      console.log(to_time)

      let first_transform_from = from_time.split('/')
      let from_year = first_transform_from[2].split(',')[0]
      let actual_time_from = first_transform_from[2].split(',')[1]
   

      let first_transform_to = to_time.split('/')
      let to_year = first_transform_to[2].split(',')[0]
      let actual_time_to = first_transform_to[2].split(',')[1]


      let from = from_year + '-'
      from+=first_transform_from[1] + '-' + first_transform_from[0] + ' ' + actual_time_from

      let to = to_year + '-'
      to+=first_transform_to[1] + '-' + first_transform_to[0] + ' ' + actual_time_to
      var result = { "from_time":from,"to_time":to}
      return result

    },
    dateFormatting(selectedOption){
      let new_dates = {
        "from_time":selectedOption[0].toLocaleString('en-GB', { timeZone: 'GMT' }),       
        "to_time":selectedOption[1].toLocaleString('en-GB', { timeZone: 'GMT' })
      }
      var formatted_date = this.dateTransformation(new_dates)
      return formatted_date
    },
    async fillChartLineDimn(selectedOption){
      ///id_player/:id_player/attributes_time_evolution
      const MEDIUM_GET_URL = this.getURL+'/id_player/'+this.id_player.toString()+'/attributes_time_evolution'
      var formatted_date = this.dateFormatting(selectedOption)
       
    
      const plotData = await Axios.post(MEDIUM_GET_URL,formatted_date);
      this.series3 = plotData.data.series
      var formatted_dates_x_axis = []
      for (const date of plotData.data.categories) {
        let test_date = new Date(date)
        formatted_dates_x_axis.push(test_date.toLocaleString())
      }

      
      this.chartOptions3 = {
        chart: {
          height: '350',
          type: 'line',
          zoom: {
            enabled: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [5, 7, 5, 6, 6],
          curve: 'straight',
          dashArray: [3, 8, 5, 4, 6]
        },
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: formatted_dates_x_axis
        },       
        grid: {
          borderColor: '#f1f1f1',
        }
      }
      console.log(plotData)
      this.chartLineDimn = true
    },
    async fillChartLineDimn2(selectedOption){
      ///id_player/:id_player/attributes_time_evolution
      ///id_player/:id_player/attributes/:id_attributes/subattributes_time_evolution
      const MEDIUM_GET_URL = this.getURL+'/id_player/'+this.id_player.toString()+'/attributes/'+this.id_actualChosenDimensionLine.toString()+'/subattributes_time_evolution'
      var formatted_date = this.dateFormatting(selectedOption)
      const plotData = await Axios.post(MEDIUM_GET_URL,formatted_date);
      this.series4 = plotData.data.series
      var formatted_dates_x_axis = []
      for (const date of plotData.data.categories) {
        let test_date = new Date(date)
        formatted_dates_x_axis.push(test_date.toLocaleString())
      }
  
      this.chartOptions4 = {
        chart: {
          height: '350',
          type: 'line',
          zoom: {
            enabled: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [5, 7, 5, 6, 6],
          curve: 'straight',
          dashArray: [3, 8, 5, 4, 6]
        },
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: formatted_dates_x_axis
        },       
        grid: {
          borderColor: '#f1f1f1',
        }
      }
      console.log(plotData)
      this.chartLineDimn2 = true
    },
   
 
  }
}
</script>
