<template>
      <div class="card" >
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img :src="image" alt="Placeholder image">
              </figure>
            </div>
            <div class="media-content is-flex is-justify-content-center">
              <p class="title is-4">{{label}}</p>
            </div>
          </div>

          <div class="content">
            {{description}}
          </div>
             <div class=" is-flex is-justify-content-space-between">

          <b-button size="is-medium" native-type="submit"  type="is-warning" 
                    @click="editClick">
                  Editar                        
          </b-button>
          <b-button  size="is-medium" native-type="submit"  type="is-danger"  @click="deleteClick">
                Eliminar             
          </b-button>

        </div>
        </div>
     
    </div>
                
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
    editClick () {
      console.log('edit')
      this.$emit('handle-edit-action', {"id":this.id, "label":this.label})

    },
    deleteClick () {
      console.log('delete')
      this.$emit('handle-delete-action',{"id":this.id, "label":this.label})

    }
  }
}
</script>
<style>
</style>