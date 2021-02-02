<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar>
      Puntos de datos
      <router-link slot="right" to="/" class="button">
        Dashboard
      </router-link>
    </hero-bar>
    <section class="section is-main-section">

      <card-component
        class="has-table has-mobile-sort-spaced"
        title="Lista de punto de datos"
        icon="account-multiple"
        select
        placeholder="Selecciona un sensor"
        :selectOptions="departments"
        @selected-option-click="selectedOptionBarChartClick"
      >
        <data-endpoint-table
          :data-url="`${$router.options.base}data-sources/clients.json`"
          :checkable="true"
        />
      </card-component>

    </section>
  </div>
</template>

<script>
import Notification from '@/components/Notification'
import DataEndpointTable from '@/components/DataEndpointTable'
import CardComponent from '@/components/CardComponent'
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'DataEndpoint',
  components: {
    HeroBar,
    TitleBar,
    CardComponent,
    DataEndpointTable,
    Notification
  },
  data () {
    return {
      departments: ['Business Development', 'Marketing', 'Sales']
      
    }
  },
  computed: {
    titleStack () {
      return ['Admin', 'Tables']
    }
  },
  methods: {
    selectedOptionBarChartClick(selectedOption){
      console.log(selectedOption)
    },
  }
}
</script>
