<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar :has-right-visible="false">
      Estadisticas generales
    </hero-bar>
    <section class="section is-main-section">       
      <div class="columns">
          <div v-if="defaultChart.chartData3" class="chart-area column is-5">
            <card-component
              title="Dimensiones"
              icon="finance"
            >
                <radar-chart
                  ref="bigChart3"
                  chart-id="big-radar-chart"
                  :chart-data="defaultChart.chartData3"
                  :extra-options="defaultChart.extraOptions3"
                >
                </radar-chart>
          
            </card-component>

            
          </div>
          <div v-if="defaultChart.chartData2" class="chart-area  column is-7">
             <card-component
              title="Sub-atributos"
              icon="finance"
              select
              placeholder="Selecciona una dimension"
              :selectOptions="departments"
              @selected-option-click="selectedOptionBarChartClick"
            >
            <bar-chart
              ref="bigChart2"
              style="height: 100%;"
              chart-id="big-bar-chart"
              :chart-data="defaultChart.chartData2"
              :extra-options="defaultChart.extraOptions2"
            >
            </bar-chart>
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
import BarChart from '@/components/Charts/BarChart'
import RadarChart from '@/components/Charts/RadarChart'

export default {
  name: 'Dashboard',
  components: {
    ClientsTableSample,
    LineChart,
    CardComponent,
    CardWidget,
    Tiles,
    HeroBar,
    TitleBar,
    BarChart,
    RadarChart
  },
  data () {
    return {
      department: null,
      departments: ['Business Development', 'Marketing', 'Sales'],
      defaultChart: {
        chartData: null,
        chartData2: null,
        chartData3: null,
        extraOptions: chartConfig.chartOptionsMain,
        extraOptions2: chartConfig.barChartOptions,
        extraOptions3: chartConfig.radarChartOptions
      }
    }
  },
  computed: {
    titleStack () {
      return ['Admin', 'Dashboard']
    }
  },
  mounted () {
    this.fillChartData()
    this.fillChartData2()
    this.fillChartData3()

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
    fillChartData3 () {
      this.defaultChart.chartData3 = {
            labels: ['Running', 'Swimming', 'Eating', 'Cycling'],
            datasets: [{
                label: 'Data One',
                pointBackgroundColor: 'white',
                borderWidth: 1,
                backgroundColor: chartConfig.chartColors.default.info,
                pointBorderColor: '#249EBF',
                  data: [12, 10, 4, 2]
            }]
      }
    }
  }
}
</script>
