<template>
  <b-modal v-model="localToggle" width="auto"  scroll="clip" :on-cancel="resettingDataAndClose" >
    <form action="">
        <div class="modal-card"  >
                <header class="modal-card-head">
                          <p v-if="modalTotalCount > 1" class="modal-card-title">{{title}} [{{modalActualCount+1}}/{{modalTotalCount}}]</p>
                          <p  class="modal-card-title" v-else> {{title}} </p>
                          <button
                              type="button"
                              class="delete"
                              @click="resettingDataAndClose"/>
                </header>
                <div class="modal-card-body"  >
                    <slot />
                    <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading>
                </div>
                <footer class="modal-card-foot is-flex is-flex-direction-row is-justify-content-space-between">
                    <b-button
                        v-if="modalTotalCount > 1 && modalActualCount >= 1"
                        label="Anterior"
                        style="float:left"
                        type="is-primary" 
                        @click="goBack()"/>                          
                    <b-button
                        v-if="modalActualCount === modalTotalCount-1"
                        :label="lastStepButtonLabel"
                        type="is-primary" 
                        style="float:right"

                        @click="confirmModal()"
                        />
                    <b-button
                        v-else
                        label="Siguiente"
                        type="is-primary" 
                        style="float:right"

                        @click="nextModal()"/>
                </footer>
        </div>
    </form>

  </b-modal>
</template>

<script>
export default {
  name: 'InstructionStepsModal',
  props: {

    title: {
        type: String,
        default: ''
    },
     modalActualCount: {
        type: Number,
        default: 0
    },
     modalTotalCount: {
        type: Number,
        default: 0
    },
    lastStepButtonLabel: {
        type: String,
        default: ''
    },
    isLoading : {
        type: Boolean,
        default: false
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
    nextModal(){
      this.$emit('go-next-click')

    },
    confirmModal(){
      this.$emit('go-confirm-click')

    },
    goBack(){
      this.$emit('go-back-click')

    },
    resettingDataAndClose(){
      this.$emit('reset-data-and-close-click')
    }
  }
}
</script>
<style scoped>
.scroll{
    overflow-y:hidden;
}
</style>