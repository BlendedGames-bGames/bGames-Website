<template>
  <b-modal v-model="localToggle" :width="640"  scroll="clip" >
        <div class="card"  >
            <header class="modal-card-head">
                <p class="modal-card-title">Instruccion de asociacion al sensor {{sensorName}}</p>
                <button
                    type="button"
                    class="delete"
                    @click="hide"/>
            </header>
            <div class="card-content"  >
            <slot />
            </div>
             <footer class="modal-card-foot is-flex is-flex-direction-row is-justify-content-space-between">
                    <b-button
                     
                        label="Cancelar"
                        style="float:left"
                        type="is-primary" 
                        @click="hide"/>                          
                    <b-button
                        label="Asociar"
                        type="is-info" 
                        style="float:right"
                        @click="associateClick"
                    />
            </footer>
        </div>

  </b-modal>
</template>

<script>
export default {
  name: 'InstructionsModal',
  props: {

    sensorName: {
        type: String,
        default: ''
    }
  },
   data () {
          
    return {
        localToggle:true
    }
  },
   mounted () {
       console.log('hola')
       console.log(this.localToggle)
  },
  methods: {    
    associateClick (){
      console.log('En proceso de asociar')
      this.$emit('associate-verification-click')

    },
    hide(){
      console.log('Deshacerse')
      this.$emit('associate-hide-click')
    }
  }
}
</script>
<style scoped>
.scroll{
    overflow-y:hidden;
}
</style>