<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar backgroundColor="transparent" dark status-bar :border="false" height="0px"></uni-nav-bar>
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height+'px'}">
			<view class="container">
				<view style="color: #fff;text-align: center;padding: 20px 0;">自定义首页</view>
			</view>
		</scroll-view>
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
		onLoad() {
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
			
			this.init()
		},
		computed: {
			...mapGetters(['user'])
		},
		methods: {
			init() {
				
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
