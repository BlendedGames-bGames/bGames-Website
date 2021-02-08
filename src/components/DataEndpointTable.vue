<template>
  <div>
    <b-table
      v-if="loaded"
      :checked-rows.sync="checkedRows"
      :checkable="checkable"
      :loading="isLoading"
      :paginated="paginated"
      :per-page="perPage"
      :striped="true"
      :hoverable="true"
      default-sort="name"
      :data="table_data"
    >
      
      <b-table-column label="Sensor" field="name_online_sensor" sortable v-slot="props">
        {{ props.row.name_online_sensor }}
      </b-table-column>
      <b-table-column label="Punto de datos" field="name_sensor_endpoint" sortable v-slot="props">
        {{ props.row.name_sensor_endpoint }}
      </b-table-column>
      <b-table-column label="Descripcion" field="description" v-slot="props">
        {{ props.row.description }}
      </b-table-column>
      <b-table-column label="Dimension" field="name_dimension" sortable v-slot="props">
        {{ props.row.name_dimension }}
      </b-table-column>
      <b-table-column label="Subatributo" field="name_subattributes" sortable v-slot="props">
        {{ props.row.name_subattributes }}
      </b-table-column>
      <b-table-column label="Dato" field="data" sortable v-slot="props">
        {{ props.row.data }}
      </b-table-column>
      <b-table-column label="Obtenido fecha" centered v-slot="props">
        <span class="tag is-success">
                    {{ new Date(props.row.created_time).toString() }}
        </span>
      </b-table-column>
     <section slot="empty" class="section">
        <div class="content has-text-grey has-text-centered">
          <template v-if="isLoading">
            <p>
              <b-icon icon="dots-horizontal" size="is-large" />
            </p>
            <p>Fetching data...</p>
          </template>
          <template v-else>
            <p>
              <b-icon icon="emoticon-sad" size="is-large" />
            </p>
            <p>Nothing's here&hellip;</p>
          </template>
        </div>
      </section>
    </b-table>
  </div>
</template>

<script>
import Axios from 'axios'
import ModalBox from '@/components/ModalBox'
import { mapGetters } from 'vuex'
import {baseURL, getPort} from '../store/urls'

export default {
  name: 'DataEndpointTable',
  components: { ModalBox },
  props: {
    checkable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isModalActive: false,
      trashObject: null,
      table_data: [],
      isLoading: false,
      paginated: false,
      perPage: 10,
      checkedRows: [],
      getURL:baseURL+getPort,
      loaded:false
    }
  },
  computed: {
     ...mapGetters('user', {
          userDimensionLevels: 'userDimensionLevels',
          userLevels: 'userLevels',
          id_player: 'id_player',
          dimensionSocket: 'dimensionSocket'

    }),
  },
  async mounted () {
    await this.loadingData()
    
  },

  methods: {
    async loadingData(){
      this.isLoading = true
      const MEDIUM_GET_URL = this.getURL+'/id_player/'+this.id_player.toString()+'/adquired_subattributes_list'
      try {
            const subatts = await Axios.get(MEDIUM_GET_URL);
            this.table_data = subatts.data
            console.log(this.table_data)
             if (this.table_data .length > this.perPage) {
              this.paginated = true
            }
            this.isLoading = false
            this.loaded = true
      } catch (error) {
          this.$buefy.toast.open({
            message: `Error: ${e.message}`,
            type: 'is-danger'
          })
      }
   
    }
  }
}
</script>
