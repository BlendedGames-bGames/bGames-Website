<template>
  <div class="card"  >
    <header v-if="title" class="card-header">
      <p class="card-header-title">
        <b-icon v-if="icon" :icon="icon" custom-size="default" />
        {{ title }}
      </p>
      
      <div class="card-header-icon"> 
         <b-field  v-if="select" horizontal :label="label" style="margin-right:2em; margin-top:1em">
            <b-select
                 
                  v-model="selectedOption"
                  :placeholder="placeholder"
                  @input="selectedOptionClick"
                  style="margin-right:2em"
                  required
                >
                  <option
                    v-for="(option, index) in selectOptions"
                    :key="index"
                    :value="option"
                  >
                    {{ option }}
                  </option>
            </b-select>
         </b-field>
        
        <div v-if="rangeDates" class="is-flex 	" style="margin-top:1em">
            <b-field  horizontal label="Desde" style="margin-right:2em">
                  <b-datetimepicker
                      placeholder="Click to select..."
                      :max-datetime="maxDatetime"
                      v-model="from">
                  </b-datetimepicker>
          </b-field>

          <b-field  horizontal label="Hasta" style="margin-right:2em">

                  <b-datetimepicker
                      placeholder="Click to select..."
                      :max-datetime="maxDatetime"
                      v-model="to">
                  </b-datetimepicker>
            </b-field>
            <b-button  type="is-link" @click="queryClicked"
            >
                    Consultar
            </b-button>
       
          
        </div>
        <div v-if="simpleButton" class="">
              <b-button  type="is-link" @click="simpleButtonClicked"
                >
                        {{simpleButtonLabel}}
                </b-button>
        </div>
         

      </div>
   
    </header>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
    title: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: 'Dimension'
    },
    icon: {
      type: String,
      default: null
    },
    headerIcon: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Select an option'
    },
    select: {
      type: Boolean,
      default: false
    },
    rangeDates:{
      type: Boolean,
      default: false
    },
    selectOptions: {
      type: Array,
      default: () => []
    },
    simpleButton: {
      type: Boolean,
      default: false
    },
    simpleButtonLabel: {
      type: String,
      default: ''
    }
  },
   data () {
      const min = new Date()
      min.setDate(min.getDate() - 7)
      min.setHours(9)
      min.setMinutes(0)
      min.setSeconds(0)
      const max = new Date()
      max.setDate(max.getDate() + 7)
      max.setHours(18)
      max.setMinutes(0)
      max.setSeconds(0)
          
    return {
      isLoading: false,
      selectedOption:null,
      from:null,
      to:null,
      minDatetime: min,
      maxDatetime: max      
    }
  },
  methods: {
    headerIconClick () {
      this.$emit('header-icon-click')
    },
    selectedOptionClick (){
      console.log('asdasasddas')
      this.$emit('selected-option-click', this.selectedOption )

    },
    queryClicked (){
      console.log('asdasasddas2')
      this.$emit('query-option-click', [this.from, this.to] )

    },
    simpleButtonClicked (){
      console.log('asdasasddas3')
      this.$emit('handle-simple-click' )

    }
  }
}
</script>
