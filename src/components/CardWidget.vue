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
          <b-button style="margin-top:1em" size="is-medium" native-type="submit"  type="is-info">
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
    }
  }
}
</script>
<style>
</style>