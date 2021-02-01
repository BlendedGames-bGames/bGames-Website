import { Radar, mixins } from 'vue-chartjs'

export default {
  name: 'radar-chart',
  extends: Radar,
  mixins: [mixins.reactiveProp],
  props: {
    extraOptions: Object
  },
  data () {
    return {
      ctx: null
    }
  },
  mounted () {
    console.log(this.chartData)
    this.$watch(
      'chartData',
      (newVal, oldVal) => {
        if (!oldVal) {
          this.renderChart(this.chartData, this.extraOptions)
        }
      },
      { immediate: true }
    )
  }
}
