<template>
  <footer v-show="isFooterBarVisible" class="footer">
    <div class="container-fluid ">
      <div class="level is-flex is-justify-content-space-between">
        <div class="level-left">
          <div class="level-item">
            <div class="footer-copyright">
              <b>&copy; Blended Games, {{ year }}</b> &mdash; 
              <span class="tag">v1.5.0</span>
            </div>
          </div>
        </div>
        <div class="level-left">
          <div class="level-item">
            <div class="footer-copyright">
                          
            <router-link to="/privacy_policy">
                        <b> Politicas de privacidad</b>  
              </router-link>    
            </div>
          </div>
        </div>
       
      </div>
    </div>
  </footer>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'

export default {
  name: 'FooterBar',
  computed: {
    year () {
      return dayjs().year()
    },
    ...mapState(['isFooterBarVisible'])
  }
}
</script>
