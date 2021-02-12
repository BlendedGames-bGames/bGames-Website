<template>
  <div>
    <hero-bar>
      Asociacion a sensores basados en software
    </hero-bar>
    <section class="section is-main-section">
      <card-component title="Forms" icon="ballot">
          <tiles>
              <card-widget  
                v-for="(sensor, index) in sensorTemplates"
                :key="index"
                class="tile is-child"
                type="is-primary"
                icon="account-multiple"
                :image="sensor.image"
                :description="sensor.description"
                :label="sensor.name"/>
            
          </tiles>
      </card-component>
    </section>
  </div>
</template>

<script>
import CardWidget from '@/components/CardWidget'
import Tiles from '@/components/Tiles'
import { mapGetters, mapActions } from 'vuex'

import mapValues from 'lodash/mapValues'
import TitleBar from '@/components/TitleBar'
import CardComponent from '@/components/CardComponent'
import CheckboxPicker from '@/components/CheckboxPicker'
import RadioPicker from '@/components/RadioPicker'
import FilePicker from '@/components/FilePicker'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'SensorAsociation',
  components: {
    HeroBar,
    FilePicker,
    RadioPicker,
    CheckboxPicker,
    CardComponent,
    TitleBar,
    Tiles,
    CardWidget
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
      customElementsForm: {
        checkbox: [],
        radio: null,
        switch: true,
        file: null
      },
      departments: ['Business Development', 'Marketing', 'Sales']
    }
  },
  computed: {
    ...mapGetters('sensor', {
          sensorTemplates: 'sensorTemplates'
    }),
  },
  methods: {
    associate () {},
    dissociate () {}
  }
}
</script>
