<template>

		 <timer :time="prettyTime"></timer>
		  
</template>

<script>
import Timer from './timer'

export default {
  name: 'mainTimer',
  components: {
		 'timer':Timer
	},
	data() {
    	return {
		 isRunning: false,
		 minutes:0,
		 secondes:0,
		 time:310,
		 timer:null,
		}
	},
	computed: {
		prettyTime () {
			 let time = this.time / 60
			 let minutes = parseInt(time)
			 let secondes = Math.round((time - minutes) * 60)
			 return minutes+":"+secondes
		}
	},
	mounted(){
		this.start()
	},
	methods: {
		 start () {
			 if (!this.timer) {
				  this.timer = setInterval( () => {
						if (this.time > 0) {
							 this.time--
						} else {
							 clearInterval(this.timer)
							 this.$emit('time-is-up')
						}
				  }, 1000 )
			 }
		 }
	}
}
</script>
