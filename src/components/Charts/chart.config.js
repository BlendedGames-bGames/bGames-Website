export const chartColors = {
  default: {
    primary: '#00D1B2',
    info: '#209CEE',
    danger: '#FF3860'
  },
  colorArray: ['#00D1B2', '#209CEE', '#FF3860']
}

export const baseChartOptions = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  responsive: true
}
export const barChartOptions = {
  ...baseChartOptions,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        gridLines: {
          display: true
        }
      }],
      xAxes: [{
        ticks: {
          beginAtZero: true
        },
        gridLines: {
          display: false
        }
      }]
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: true,
      callbacks: {
        label: function(tooltipItems, data) {
          return '$' + tooltipItems.yLabel;
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
}
export const radarChartOptions = {
  ...baseChartOptions,
  scales: {
    angleLines: {
        display: false
    },
    suggestedMin: 0,
    suggestedMax: 100
  },
  tooltips: {
    enabled: true,
    callbacks: {
      label: function(tooltipItems, data) {
        console.log(tooltipItems)
        console.log(data)

        return tooltipItems.label;
      },
      title: function(tooltipItems, data) {
        console.log(tooltipItems)
        console.log(data)

        return data.labels[tooltipItems[0].index];
      }
    }
  },

  responsive: true,
  maintainAspectRatio: false
}
export const chartOptionsMain = {
  ...baseChartOptions,
  tooltips: {
    backgroundColor: '#f5f5f5',
    titleFontColor: '#333',
    bodyFontColor: '#666',
    bodySpacing: 4,
    xPadding: 12,
    mode: 'nearest',
    intersect: 0,
    position: 'nearest'
  },
  scales: {
    yAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: 'transparent'
        },
        ticks: {
          padding: 20,
          fontColor: '#9a9a9a'
        }
      }
    ],

    xAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(225,78,202,0.1)',
          zeroLineColor: 'transparent'
        },
        ticks: {
          padding: 20,
          fontColor: '#9a9a9a'
        }
      }
    ]
  }
}
