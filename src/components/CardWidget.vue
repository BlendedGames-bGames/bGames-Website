<template>
  <card-component class="is-card-widget">
    <div class="level is-mobile is-card-widget">
      <div class="level-item is-flex is-flex-direction-column is-align-items-center">
        <div class=" is-widget-title is-flex is-flex-direction-row " style="width:100%">
          <img :src="image" style="max-width:80px" alt="JustBoil.me" />
          <h1 class="title is-flex  is-flex-direction-row is-align-self-center">
            {{ label }}
          </h1>
        </div>
        <div class=" is-widget-description is-flex is-flex-direction-column is-justify-content-center is-align-items-center" style='padding: 3px; '>
          <p class="description  ">
              {{description}}

          </p>
          <b-button  v-if="associate"  style="margin-top:1em" size="is-medium" native-type="submit"  type="is-info" outlined
                    @click="associating">
                  Desasociar                        
          </b-button>
          <b-button v-else style="margin-top:1em" size="is-medium" native-type="submit"  type="is-info"  @click="associating">
                Asociar             
          </b-button>
      
        </div>
      </div>

    </div>
    </card-component>
</template>

<script>
import CardComponent from '@/components/CardComponent'
export default {
  name: 'CardWidget',
  components: { CardComponent },
  props: {
    icon: {
      type: String,
      default: null
    },
    number: {
      type: Number,
      default: 0
    },
    id: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: ''
    },
    image:{
      type: String,
      default: ''
    },
    associate:{
      type: Boolean,
      default: false
    }
  },
  methods: {
    associating () {
      console.log('adsasdasd')
      let bool = this.associate
      this.$emit('handle-associate-action',{activation: !bool, id_online_sensor:this.id, name:this.label})
      //<a target="_blank" href="https://trello.com/app-key">

    }
  }
}
</script>
<style>
</style>