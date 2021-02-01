<template>
  <div class="card"  >
    <header v-if="title" class="card-header">
      <p class="card-header-title">
        <b-icon v-if="icon" :icon="icon" custom-size="default" />
        {{ title }}
      </p>
      <a
        v-if="headerIcon"
        href="#"
        class="card-header-icon"
        aria-label="more options"
        @click.prevent="headerIconClick"
      >
        <b-icon :icon="headerIcon" custom-size="default" />
      </a>
      <div class="card-header-icon"> 
          <b-select
                v-if="select"
                v-model="selectedOption"
                :placeholder="placeholder"
                @input="selectedOptionClick"
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
    selectOptions: {
      type: Array,
      default: () => []
    }
  },
   data () {
    return {
      isLoading: false,
      selectedOption:null
      
    }
  },
  methods: {
    headerIconClick () {
      this.$emit('header-icon-click')
    },
    selectedOptionClick (){
      console.log('asdasasddas')
      this.$emit('selected-option-click', this.selectedOption )

    }
  }
}
</script>
