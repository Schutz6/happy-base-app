<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<iframe v-if="setting.kefuUrl" :src="setting.kefuUrl + `?uid=u${this.user.id}&name=${this.user.name}`" frameborder="0"></iframe>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				width: 0,//屏幕宽度
				height: 0,//屏幕高度
			}
		},
		computed: {
			...mapGetters(['user', 'setting'])
		},
		onLoad() {
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
		},
		methods: {
			
		}
	}
</script>
<style scoped lang="scss">
	.nav-title{
		font-size: 16px;
		display: flex;
		margin: 0 auto;
		align-items: center;
		font-weight: 700;
	}
	.webviewBox{
		width: 100%;
		
		iframe{
			width: 100%;
			height: 100%;
		}
	}
</style>
