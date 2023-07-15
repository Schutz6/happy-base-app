<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="代理收益" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view @scrolltolower="lower" :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="content">
				<view class="box d-flex">
					<view class="flex1 d-flex-center flex-column">
						<view class="num">{{info.one_income+info.two_income+info.three_income}}</view>
						<view class="label">累计收益</view>
					</view>
					<view class="line"></view>
					<view class="flex1 d-flex-center flex-column">
						<view class="num">{{info.one_list.length+info.two_list.length+info.three_list.length}}</view>
						<view class="label">团队人数</view>
					</view>
				</view>
				<view class="tabs d-flex">
					<view @tap="changeTab(1)" class="d-flex-center flex1 tab-left" :class="tabIndex==1?'tab-left-active':''">伞下好友</view>
					<view @tap="changeTab(2)" class="d-flex-center flex1 tab-right" :class="tabIndex==2?'tab-right-active':''">收益明细</view>
				</view>
				<view v-if="tabIndex==1" class="list list1">
					<view class="header d-flex">
						<view class="flex1 d-flex-center">会员账号</view>
						<view class="flex1 d-flex-center">层级</view>
						<view class="flex1 d-flex-center">已充值</view>
					</view>
					<view class="line"></view>
					<view class="item d-flex" v-for="(item, index) in info.one_list" :key="10000+index">
						<view class="flex1 d-flex-center">{{item.uid}}</view>
						<view class="flex1 d-flex-center">{{item.level}}代</view>
						<view class="flex1 d-flex-center">{{item.total_recharge}}</view>
					</view>
					<view class="item d-flex" v-for="(item, index) in info.two_list" :key="20000+index">
						<view class="flex1 d-flex-center">{{item.uid}}</view>
						<view class="flex1 d-flex-center">{{item.level}}代</view>
						<view class="flex1 d-flex-center">{{item.total_recharge}}</view>
					</view>
					<view class="item d-flex" v-for="(item, index) in info.three_list" :key="30000+index">
						<view class="flex1 d-flex-center">{{item.uid}}</view>
						<view class="flex1 d-flex-center">{{item.level}}代</view>
						<view class="flex1 d-flex-center">{{item.total_recharge}}</view>
					</view>
				</view>
				<view v-if="tabIndex==2" class="list list2">
					<view class="item" v-if="list.length > 0" v-for="(item, index) in list" :key="index">
						<view class="item-box">
							<view class="title">+{{item.money}}</view>
							<view>{{item.remarks}}</view>
						</view>
					</view>
					<uni-load-more v-if="list.length > 0" :status="moreStatus"></uni-load-more>
					<view class="no-data" v-if="list.length==0">
						<view class="d-flex-center flex-column">
							<view class="fs14">暂无数据</view>
						</view>
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
				tabIndex: 1,
				moreStatus: "more",
				listQuery: {
					currentPage: 1,
					pageSize: 20
				},
				list: [],
				info: {
					"one_list": [],
					"one_income": 0,
					"two_list": [],
					"two_income": 0,
				    "three_list": [],
					"three_income": 0
				}
			}
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
			//切换Tab
			changeTab(tabIndex){
				if(this.tabIndex != tabIndex){
					this.tabIndex = tabIndex
				}
			},
			init() {
				//团队信息
				this.$api.get("/agent/team/").then(res => {
					if(res.code == 20000){
						this.info = res.data
					}
				})
				//获取列表
				this.getList()
			},
			//获取列表
			getList(){
				this.$api.post("/agent/incomeList/", this.listQuery).then(res => {
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
		.box{
			background-image: url(../../static/login/box-bg.png);
			background-size: 100% 100%;
			border-radius: 6px;
			height: 100px;
			margin: 16px;
			
			.line{
				width: 1px;
				height: 40px;
				background: rgba(255,255,255,0.4);
			}
			
			.num{
				font-weight: bold;
				color: #FFFCFC;
				font-size: 20px;
			}
			.label{
				font-weight: 400;
				color: #fff;
				font-size: 12px;
				padding-top: 10px;
			}
		}
		
		.tabs{
			margin-top: 15px;
			width: 100%;
			height: 40px;
			font-size: 16px;
			color: rgba(255,255,255,0.7);
			
			text{
				font-size: 12px;
				font-weight: 400;
				color: rgba(255,255,255,0.7);
			}
			
			.tab-left{
				height: 40px;
				background-image: url(../../static/me/tab-left.png);
				background-size: 100% 100%;
			}
			.tab-left-active{
				background-image: url(../../static/me/tab-left-select.png);
				background-size: 100% 100%;
				color: #fff;
			}
			.tab-right{
				height: 40px;
				background-image: url(../../static/me/tab-right.png);
				background-size: 100% 100%;
			}
			.tab-right-active{
				background-image: url(../../static/me/tab-right-select.png);
				background-size: 100% 100%;
				color: #fff;
			}
		}
	
		.list{
			
			.header{
				font-weight: 400;
				color: #000;
				font-size: 14px;
				padding: 15px 0;
			}
			
			.line{
				width: 100%;
				height: 1px;
				background: #66666661;
			}
			
			.item{
				font-weight: 400;
				color: rgba(0,0,0,0.7);
				font-size: 14px;
				padding: 10px 0;
				
				.item-box{
					padding: 5px 0;
					margin: 0 16px;
					border-bottom: 1px solid rgba(0,0,0,0.1);
					
					.title{
						font-size: 16px;
						color: #fff;
						font-weight: bold;
					}
				}
				
			}
		}
	}
</style>
