<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="我的团队" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="container">
				<view class="box">
					<view class="header d-flex between">
						<view class="title d-flex">
							<image src="@/static/me/wallet.png"></image>
							<view>累计奖金</view>
						</view>
						<view class="num">{{info.one_income+info.two_income+info.three_income}}</view>
					</view>
					<view class="content d-flex-center">
						<view class="flex1 d-flex-center flex-column">
							<view class="num">{{info.one_income}}</view>
							<view class="label">一级奖金</view>
						</view>
						<view class="flex1 d-flex-center flex-column">
							<view class="num">{{info.two_income}}</view>
							<view class="label">二级奖金</view>
						</view>
						<view class="flex1 d-flex-center flex-column">
							<view class="num">{{info.three_income}}</view>
							<view class="label">三级奖金</view>
						</view>
					</view>
				</view>
				<view class="box">
					<view class="header d-flex between">
						<view class="title d-flex">
							<image src="@/static/me/team.png"></image>
							<view>团队人数</view>
						</view>
						<view class="num">{{info.one_list.length+info.two_list.length+info.three_list.length}}</view>
					</view>
					<view class="content d-flex-center">
						<view class="flex1 d-flex-center flex-column">
							<view class="num">{{info.one_list.length}}</view>
							<view class="label">一级人数</view>
						</view>
						<view class="flex1 d-flex-center flex-column">
							<view class="num">{{info.two_list.length}}</view>
							<view class="label">二级人数</view>
						</view>
						<view class="flex1 d-flex-center flex-column">
							<view class="num">{{info.three_list.length}}</view>
							<view class="label">三级人数</view>
						</view>
					</view>
				</view>
				<view class="d-flex-center" style="font-weight: 500;font-size: 16px;padding-bottom: 10px;">团队成员</view>
				<view class="table-box">
					<view class="list">
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
			
			this.$api.get("/agent/team/").then(res => {
				if(res.code == 20000){
					this.info = res.data
				}
			})
		},
		methods: {
			back(){
				navigateBack()
			},
		}
	}
</script>

<style scoped lang="scss">
	.container{
		padding: 16px;
		background-color: #fff;
		
		.box{
			background-image: url(../../static/me/team-box.png);
			background-size: 100% 100%;
			border-radius: 6px;
			height: 150px;
			margin-bottom: 20px;
			
			.header{
				padding: 16px;
					
				.title{
					font-weight: 500;
					color: #FFFFFF;
					font-size: 14px;
					
					image{
						width: 24px;
						height: 24px;
						margin-right: 7px;
					}
				}
				
				.num{
					font-weight: bold;
					color: #FFFCFC;
					font-size: 24px;
				}
			}
			
			.content{
				height: 80px;
				
				.num{
					font-weight: bold;
					color: #FFFCFC;
					font-size: 20px;
				}
				
				.label{
					font-weight: 400;
					color: rgba(255,255,255,0.7);
					font-size: 12px;
				}
			}
		}
		
		.table-box{
			width: 100%;
			background: #1B2241;
			box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.24);
			border-radius: 10px;
			border: 1px solid #294D6B;
			
			.list{
				
				.header{
					font-weight: 400;
					color: #FFFFFF;
					font-size: 14px;
					padding: 15px 0;
				}
				
				.line{
					width: 100%;
					height: 1px;
					background: #24415B;
				}
				
				.item{
					font-weight: 400;
					color: rgba(255,255,255,0.7);
					font-size: 14px;
					padding: 10px 0;
				}
			}
		}
	}
</style>
