<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="在线客服" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<view :style="{'height': height-44+'px'}">
			<iframe v-if="params.kefuUrl" :src="params.kefuUrl + `?uid=u${this.user.id}&name=${this.user.name}`" frameborder="0"></iframe>
		</view>
	</view>
</template>

<script>
	import { navigateBack } from '@/utils/util'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				width: 0,//屏幕宽度
				height: 0,//屏幕高度
			}
		},
		computed: {
			...mapGetters(['user', 'params'])
		},
		onLoad() {
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
		},
		methods: {
			//返回
			back(){
				navigateBack()
			},
		}
	}
</script>
<style scoped lang="scss">
	.page{
		iframe{
			width: 100%;
			height: 100%;
		}
	}
</style>
