<template>
  <div>
      <b-field  vertical
                :label="label" style="margin-bottom: 1em">
            <b-select
                    v-model="selectedOption"
                    :placeholder="placeholder"
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
        <div>
          <slot />
        </div>
        <b-button size="is-small"  type="is-link" @click="selectedOptionClick"
                style="margin-bottom: 2em"
        >
                Consultar
        </b-button>
  </div>
</template>

<script>

export default {
    name: 'SingleComponent',  
    props: {
        required:{
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: 'Label'
        },
        placeholder: {
            type: String,
            default: 'Select an option'
        },
        selectOptions: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            selectedOption: null,      
        }
    },
    methods: {
        selectedOptionClick (){
        console.log('asdasasddas')
        this.$emit('selected-option-click', this.selectedOption )

        }
    }
}
</script>
