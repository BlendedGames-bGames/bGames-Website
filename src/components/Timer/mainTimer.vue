<template>

		 <timer v-if="isReady" :time="prettyTime"></timer>
		  
</template>

<script>
import Timer from './timer'

export default {
	name: 'mainTimer',
	components: {
		'timer':Timer
	},
	props: {
    	time: {
			type: Number,
			default: 310
		}
  	},
	data() {
		return {
			isReady: false,
			minutes:0,
			secondes:0,
			timer:null,
			localTime:0
			
		}
	},
	computed: {
		prettyTime () {
				let time = this.localTime / 60
				let minutes = parseInt(time)
				let secondes = Math.round((time - minutes) * 60)
				return minutes+":"+secondes
		}
	},
	mounted(){
		this.localTime = this.time
		this.start()
	},
	methods: {
			start () {
				if (!this.timer) {
					this.isReady = true
					this.timer = setInterval( () => {
						if (this.localTime > 0) {
								this.localTime--
								this.$emit('actual-time', this.localTime)
						} else {
							this.stopTimer()
							this.$emit('time-is-up')
						}
					}, 1000 )
				}
			},
			stopTimer(){
				clearInterval(this.timer)
			}
	}
}
</script>
