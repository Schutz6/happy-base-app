<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="选择区号" backgroundColor="transparent" status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#424357" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="content">
				<view style="padding: 10px;">
					<uni-easyinput trim="both" v-model="searchWord" :styles="styles" placeholder="搜索"></uni-easyinput>
				</view>
				<view class="list">
					<view class="item" v-for="(item, index) in list.filter(data => !searchWord || data.text.includes(searchWord) || data.value.includes(searchWord))" :key="index" @click="change(item.value)">
						<view>{{item.text}}</view>
						<view>+{{item.value}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { navigateBack } from '@/utils/util'
	export default {
		data() {
			return {
				width: 0,//屏幕宽度
				height: 0,//屏幕高度
				searchWord: "",//搜索词
				list: [],
				styles: {
					color: '#000',
					backgroundColor: 'transparent'
				},
			}
		},
		onLoad() {
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
			
			//获取国家列表
			this.$api.post("/dict/getList/", {"name": "AreaCode"}).then(res=>{
				this.list = res.data
			})
		},
		methods: {
			//返回
			back(){
				navigateBack()
			},
			//选择区号
			change(value){
				uni.$emit('updateAreaData', {"area": value})
				this.back()
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		.search-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px;
		}
		.list{
			
			.item{
				color: #000;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10px;
				border-bottom: 1px solid #66666661;
				font-size: 14px;
			}
		}
	}
</style>
