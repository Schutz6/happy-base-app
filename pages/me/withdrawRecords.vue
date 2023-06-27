<template>
	<view class="width-max height-max">
		<uni-nav-bar backgroundColor="transparent" title="提现记录" dark status-bar fixed :border="false" height="44px" :leftWidth="60" :rightWidth="60">
			<block slot="left">
				<image @tap="back()" src="@/static/index/icon-left.png" style="height: 16px;width: 16px;"></image>
			</block>
		</uni-nav-bar>
		<view class="container">
			<view class="time-query d-flex">
				<uni-datetime-picker v-model="range" type="daterange" :clear-icon="false" />
				<image @tap="search()" src="@/static/me/search.png" style="width: 35px;height: 35px;margin-left: 16px;"></image>
			</view>
			<view class="box" v-if="list.length > 0">
				<view class="list">
					<view class="item d-flex between" v-for="(item, index) in list" :key="index">
						<view class="left d-flex">
							<image src="../../static/me/withdrawal.png"></image>
							<view class="d-flex flex-column" style="align-items: start;padding-left: 10px;">
								<view class="title">
									<text v-if="item.status == 0">正在审核</text>
									<text v-else-if="item.status == 1">提现成功</text>
									<text v-else-if="item.status == 2">提现失败</text>
								</view>
								<view class="label">
									<uni-dateformat :date="item.add_time | formatDate" format="yyyy-MM-dd hh:mm"></uni-dateformat>
								</view>
							</view>
						</view>
						<view class="right d-flex flex-column" style="align-items: end;">
							<view class="title">{{item.real_money}}<text>元</text></view>
							<view class="label">
								<text v-if="item.status == 1">已到账</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more v-if="list.length > 0" :status="moreStatus"></uni-load-more>
			<view class="no-data" v-if="list.length == 0">
				<view class="d-flex-center flex-column">
					<image src="@/static/me/logo.png" style="width: 66px;height: 40px;padding: 20px 0;"></image>
					<view>目前尚无数据</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { navigateBack, formatDateUtc } from '@/utils/util'
	export default {
		data() {
			return {
				range: [],
				moreStatus: "more",
				listQuery: {
					currentPage: 1,
					pageSize: 20,
					start_time: null,
					end_time: null
				},
				list: []
			}
		},
		filters: {
		    //格式化日期
		    formatDate(time){
		    	return formatDateUtc(time)
		    }
		},
		onLoad() {
			this.init()
		},
		onReachBottom() {
			this.listQuery.currentPage += 1;
			this.getList(false)
		},
		onPullDownRefresh(){
			//监听下拉刷新
			this.listQuery.currentPage = 1
			this.list = []
			this.getList(true)
		},
		methods: {
			back(){
				navigateBack()
			},
			//搜索
			search(){
				if(this.range.length > 0){
					this.listQuery.start_time = this.range[0]
					this.listQuery.end_time = this.range[1]
				}else{
					this.listQuery.start_time = null
					this.listQuery.end_time = null
				}
				this.listQuery.currentPage = 1
				this.list = []
				this.getList(false)
			},
			init() {
				//获取列表
				this.getList(false)
			},
			//获取列表
			getList(isRefresh){
				this.$api.post("/withdrawal/list/", this.listQuery).then(res => {
					if(res.code == 20000){
						this.moreStatus = res.data.results.length == 10 ? 'more' : 'noMore';
						if(res.data.results.length > 0){
							this.list = this.list.concat(res.data.results)
						}
						if(isRefresh){
							uni.stopPullDownRefresh();
						}
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.container{
		padding: 16px;
		
		.time-query{
			
		}
		
		.box{
			width: 100%;
			background: #1B2241;
			box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.24);
			border-radius: 10px;
			border: 1px solid #294D6B;
			margin: 20px 0;
			
			.list{
				padding: 10px 15px;
				
				.item{
					padding: 10px 0;
					border-bottom: 1px solid rgba(255,255,255,0.1);
					
					.label{
						font-weight: 400;
						color: rgba(255,255,255,0.7);
						font-size: 12px;
						padding-top: 5px;
					}
					
					.left{
						image{
							width: 34px;
							height: 34px;
						}
						
						.title{
							font-size: 16px;
							font-weight: 400;
							color: #FFFFFF;
						}
					}
					
					.right{
						.title{
							font-weight: bold;
							color: #FFFFFF;
							font-size: 20px;
							
							text{
								font-weight: 400;
								color: rgba(255,255,255,0.7);
								font-size: 12px;
								padding-left: 2px;
							}
						}
					}
				}
				.item:last-child{
					border-bottom: none;
				}
			}
		}
		
	}
</style>
