<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="提现记录" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view @scrolltolower="lower" :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="content">
				<view class="box" v-if="list.length > 0">
					<view class="list">
						<view class="item d-flex between" v-for="(item, index) in list" :key="index">
							<view class="left d-flex">
								<image src="@/static/me/withdrawal.png"></image>
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
								<view class="title">{{item.money}}<text>元</text></view>
								<view class="label">
									<text v-if="item.status == 1">已到账</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more v-if="list.length > 0" :status="moreStatus"></uni-load-more>
				<view class="no-data" v-if="list.length==0">
					<view class="d-flex-center flex-column">
						<view class="fs14">暂无数据</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { navigateBack, formatDateUtc } from '@/utils/util'
	export default {
		data() {
			return {
				width: 0,//屏幕宽度
				height: 0,//屏幕高度
				range: [],
				moreStatus: "more",
				listQuery: {
					currentPage: 1,
					pageSize: 20,
					uid: null
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
		computed: {
			...mapGetters(['user'])
		},
		onLoad() {
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
			
			this.init()
		},
		methods: {
			//返回
			back(){
				navigateBack()
			},
			//滚动到底部
			lower(e){
				this.listQuery.currentPage += 1;
				this.getList()
			},
			init() {
				//获取列表
				this.getList()
			},
			//获取列表
			getList(){
				this.listQuery.uid = this.user.id
				this.$api.post("/core/list/", this.listQuery, {"Mid": "Withdraw"}).then(res => {
					if(res.code == 20000){
						this.moreStatus = res.data.results.length == 20 ? 'more' : 'noMore';
						if(res.data.results.length > 0){
							this.list = this.list.concat(res.data.results)
						}
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.content{
		padding: 16px;
		
		.box{
			width: 100%;
			background: #1B2241;
			box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.24);
			border-radius: 10px;
			border: 1px solid #294D6B;
			
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
