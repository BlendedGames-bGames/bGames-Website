<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar>
      Tables
    </hero-bar>
  </div>
</template>

<script>
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'Login',
  components: {
    HeroBar,
    TitleBar
  },
  computed: {
    titleStack () {
      return ['Admin', 'Tables']
    }
  }
}
</script>
