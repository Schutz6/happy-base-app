<template>
	<view class="page overflow-hidden">
		<view class="content">
			<view class="search-box">
				<uni-easyinput trim="both" v-model="searchWord" :styles="styles" placeholder="搜索"></uni-easyinput>
			</view>
			<view class="list">
				<view class="item" v-for="(item, index) in list.filter(data => !searchWord || data.text.includes(searchWord) || data.value.includes(searchWord))" :key="index" @click="change(item.value)">
					<view>{{item.text}}</view>
					<view>+{{item.value}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchWord: "",//搜索词
				list: [
					{
						"value": "86",
						"text": "中国大陆"
					},
					{
						"value": "852",
						"text": "中国香港"
					},
					{
						"value": "853",
						"text": "中国澳门"
					},
					{
						"value": "886",
						"text": "中国台湾"
					}
				],
				styles: {
					color: '#fff',
					backgroundColor: 'transparent'
				},
			}
		},
		onLoad() {
			//获取国家列表，后续自己加
		},
		methods: {
			search(){},
			//选择区号
			change(value){
				uni.$emit('updateAreaData', {"area": value})
				uni.navigateBack()
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
				color: #fff;
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
