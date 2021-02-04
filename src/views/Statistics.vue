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
          <div v-if="chartBarLoading" class="chart-area  column is-6">
             <card-component
              title="Sub-atributos"
              icon="finance"
              select
              placeholder="Selecciona una dimension"
              :selectOptions="departments"
              @selected-option-click="selectedOptionBarChartClick"
            >
              <apexchart type="bar" height="auto" width='100%' :options="options" :series="series2"></apexchart>

            </card-component>
            
          </div>

      </div>
      

      <card-component
        title="Evolucion de dimensiones en el tiempo "
        icon="finance"
        header-icon="reload"
        @header-icon-click="fillChartData"
      >
        <div v-if="defaultChart.chartData" class="chart-area">
          <line-chart
            ref="bigChart"
            style="height: 100%;"
            chart-id="big-line-chart"
            :chart-data="defaultChart.chartData"
            :extra-options="defaultChart.extraOptions"
          >
          </line-chart>
        </div>
      </card-component>
        <card-component
        title="Evolucion de sub-atributos en el tiempo "
        icon="finance"
        select
        placeholder="Selecciona una dimension"
        :selectOptions="departments"
        @selected-option-click="selectedOptionLineChartClick"
      >
        <div v-if="defaultChart.chartData" class="chart-area">
          <line-chart
            ref="bigChart"
            style="height: 100%;"
            chart-id="big-line-chart"
            :chart-data="defaultChart.chartData"
            :extra-options="defaultChart.extraOptions"
          >
          </line-chart>
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
import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'
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
    apexchart: VueApexCharts
  },
  data () {
    return {
      department: null,
      departments: ['Business Development', 'Marketing', 'Sales'],
      defaultChart: {
        chartData: null,
        chartData2: null,
        extraOptions: chartConfig.chartOptionsMain,
        extraOptions2: chartConfig.barChartOptions,
      },
      chartRadarLoading:false,
      chartBarLoading:false,

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
            /*data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]*/
            data:[]
      }],
      options: {
        chart: {
          type: 'bar',
          height: 380
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
          '#f48024', '#69d2e7'
        ],
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
          /*categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
            'United States', 'China', 'India'
          ],*/
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

    }),
    ...mapGetters('attribute', {
          name_dimensions: 'name_dimensions',
    }),
  },
  mounted () {
    console.log('hola')
    this.fillChartData()
    this.fillChartData2()
    this.fillChartRadar()
    this.$buefy.snackbar.open({
      message: 'Welcome back',
      queue: false
    })
  },
  methods: {
   
    selectedOptionBarChartClick(selectedOption){
      console.log(selectedOption)
    },
    selectedOptionLineChartClick(selectedOption){
      console.log(selectedOption)

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
    fillChartData () {
      this.defaultChart.chartData = {
        datasets: [
          {
            fill: false,
            borderColor: chartConfig.chartColors.default.primary,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: chartConfig.chartColors.default.primary,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: chartConfig.chartColors.default.primary,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.randomChartData(9)
          },
          {
            fill: false,
            borderColor: chartConfig.chartColors.default.info,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: chartConfig.chartColors.default.info,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: chartConfig.chartColors.default.info,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.randomChartData(9)
          },
          {
            fill: false,
            borderColor: chartConfig.chartColors.default.danger,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: chartConfig.chartColors.default.danger,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: chartConfig.chartColors.default.danger,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.randomChartData(9)
          }
        ],
        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09']
      }
    },
    fillChartData2 () {
      this.defaultChart.chartData2 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
              {
                label: 'Data One',
                backgroundColor: '#f87979',
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: '#249EBF',
                data: [40, 20, 30, 50, 90, 10, 20, 40, 50, 70, 90, 100]
              }
            ]
      }
    },
 
  }
}
</script>
