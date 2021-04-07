<template>
  <div>
    <hero-bar>
      Estadisticas en el tiempo
    </hero-bar>
    <section class="section is-main-section">
          <card-component
        title="Evolucion de dimensiones en el tiempo "
        icon="finance"
        rangeDates
        @query-option-click="selectedDatesLineChartClick"
      >

          <apexchart  v-if="chartLineDimn" type="line" height="350" :options="chartOptions3" :series="series3"></apexchart>
      
      </card-component>



        <card-component
        title="Evolucion de dimensiones en el tiempo "
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
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
import CardComponent from '@/components/CardComponent'
import VueApexCharts from 'vue-apexcharts'
import Axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
import {baseURL, getPort} from '../store/urls'
export default {
  name: 'SensorAsociation',
  components: {
    CardComponent,
    HeroBar,
    TitleBar,
    apexchart: VueApexCharts,
    
  },
  data () {
    return {
      isLoading: false,
      form: {
        name: null,
        email: null,
        phone: null,
        department: null,
        subject: null,
        question: null
      },
      getURL:baseURL+getPort,
      chartLineDimn:false,
      chartLineDimn2:false,
      id_actualChosenDimensionLine: null,
      customElementsForm: {
        checkbox: [],
        radio: null,
        switch: true,
        file: null
      },
      departments: ['Business Development', 'Marketing', 'Sales'],
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
          
    }
  },
  mounted(){
    this.SET_CURRENT_ROUTE('/time_statistics')
    window.localStorage.setItem('route','/time_statistics' )
  },
  computed: {
    titleStack () {
      return ['Admin', 'Forms']
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
  methods: {
    ...mapMutations({
      SET_CURRENT_ROUTE:'SET_CURRENT_ROUTE'
    }),
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
      this.chartLineDimn1 = false
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
      this.chartLineDimn2 = false
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
