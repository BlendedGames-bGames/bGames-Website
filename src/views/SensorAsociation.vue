<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar>
      Asociacion a sensores basados en software
      <router-link slot="right" to="/" class="button">
        Dashboard
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component title="Forms" icon="ballot">
          <tiles>
              <card-widget
                class="tile is-child"
                type="is-primary"
                icon="account-multiple"
                :number="512"
                label="Clients"
              />
              <card-widget
                class="tile is-child"
                type="is-info"
                icon="cart-outline"
                :number="7770"
                prefix="$"
                label="Sales"
              />
              <card-widget
                class="tile is-child"
                type="is-success"
                icon="chart-timeline-variant"
                :number="256"
                suffix="%"
                label="Performance"
              />
          </tiles>
      </card-component>
    </section>
  </div>
</template>

<script>
import CardWidget from '@/components/CardWidget'
import Tiles from '@/components/Tiles'

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
    titleStack () {
      return ['Admin', 'Forms']
    }
  },
  methods: {
    submit () {},
    reset () {
      this.form = mapValues(this.form, (item) => {
        if (item && typeof item === 'object') {
          return []
        }
        return null
      })

      this.$buefy.snackbar.open({
        message: 'Reset successfully',
        queue: false
      })
    }
  }
}
</script>
