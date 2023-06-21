<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar backgroundColor="transparent" dark status-bar :border="false" height="0px"></uni-nav-bar>
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height+'px'}">
			<view class="container">
				<view class="user-box d-flex flex-column">
					<view class="d-flex width-max between">
						<view class="d-flex flex1" style="padding: 20px;">
							<image :src="user.avatar" style="width: 60px;height: 60px;border-radius: 30px;border: 1px solid #fff;"></image>
							<view class="d-flex flex1 flex-column" style="padding-left: 10px;align-items: baseline;">
								<view class="mobile d-flex">
									{{user.name}}
									<image :src="'../../static/me/certified'+user.certified+'.png'"></image>
								</view>
								<view class="time d-flex">
									<view>UID：{{user.id}}</view>
								</view>
							</view>
						</view>
						<view style="margin-right: 20px;">
							<uni-icons type="gear" size="24" color="#fff"></uni-icons>
						</view>
					</view>
					<view class="tools width-max d-flex">
						<view class="item d-flex flex-column flex1">
							<view class="label">{{user.balance || "0.00"}}</view>
							<view class="label-sub">余额</view>
						</view>
						<view class="item d-flex flex-column flex1">
							<view class="label">{{user.integral || "0"}}</view>
							<view class="label-sub">积分</view>
						</view>
					</view>
				</view>
				<view class="boxs">
					<view class="box">
						<view class="tools d-flex">
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/kefu/kefu')">
								<image src="@/static/me/icon-recharge.png"></image>
								<view class="label">充值</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/me/withdrawal')">
								<image src="@/static/me/icon-withdraw.png"></image>
								<view class="label">提现</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/kefu/kefu')">
								<image src="@/static/me/icon-kefu.png"></image>
								<view class="label">客服</view>
							</view>
						</view>
					</view>
					<view style="padding: 16px 0;">
						<image  @tap="toPage('/pages/me/invite')" src="@/static/me/banner.png" style="width: 100%;height: 80px;"></image>
					</view>
					<view class="box">
						<view class="fast-tools d-flex">
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/me/buyRecords')">
								<image src="@/static/me/icon-02.png"></image>
								<view class="label">购买记录</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/me/rechargeRecords')">
								<image src="@/static/me/icon-03.png"></image>
								<view class="label">充值记录</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/me/withdrawalRecords')">
								<image src="@/static/me/icon-04.png"></image>
								<view class="label">提现记录</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/me/realname')">
								<image src="@/static/me/icon-06.png"></image>
								<view class="label">实名认证</view>
							</view>
						</view>
						<view class="fast-tools d-flex">
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/bank/bank')">
								<image src="@/static/me/icon-07.png"></image>
								<view class="label">绑定提现卡</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/me/updatePayPassword')">
								<image src="@/static/me/icon-08.png"></image>
								<view class="label">修改支付密码</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/me/updatePassword')">
								<image src="@/static/me/icon-09.png"></image>
								<view class="label">修改登录密码</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/me/team')">
								<image src="@/static/me/icon-10.png"></image>
								<view class="label">我的团队</view>
							</view>
						</view>
						<view class="fast-tools d-flex" style="padding-bottom: 20px;">
							<view class="flex1 d-flex flex-column" @tap="toPage('/pages/me/agent')">
								<image src="@/static/me/icon-11.png"></image>
								<view class="label">代理奖金</view>
							</view>
							<view class="flex1">
								<uni-link :href="params.downloadUrl" :showUnderLine="false">
									<view class="d-flex flex-column">
										<image src="@/static/me/icon-12.png"></image>
										<view class="label">下载APP</view>
									</view>
								</uni-link>
							</view>
							<view class="flex1 d-flex flex-column"></view>
							<view class="flex1 d-flex flex-column"></view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<uni-popup ref="logoutDialog" type="center" :animation="false">
			<view class="dialog-box">
				<view class="content">是否退出登录？</view>
				<view class="line"></view>
				<view class="d-flex-center footer">
					<view class="flex1 cancel" @tap="hideDialog('logoutDialog')">取消</view>
					<view class="line"></view>
					<view class="flex1 confirm" @tap="logout()">确认</view>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { formatDateUtc } from '@/utils/util'
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
		filters: {
		    //格式化日期
		    formatDate(time){
		    	return formatDateUtc(time)
		    }
		},
		onLoad() {
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
		},
		methods: {
			//跳转
			toPage(page){
				if(page === "/pages/kefu/kefu"){
					uni.switchTab({
						url: page
					})
				}else{
					uni.navigateTo({
						url: page
					})
				}
			},
			//退出登录
			logout(){
				this.$api.get("/logout/").then(res => {
					uni.reLaunch({
						url: '/pages/common/login/login'
					})
				})
			},
			//显示弹出框
			showDialog(id){
				this.$refs[id].open()
			},
			//关闭弹出框
			hideDialog(id){
				this.$refs[id].close()
			},
		}
	}
</script>

<style scoped lang="scss">
	.dialog-box{
		width: 260px;
		height: 123px;
		background: #1B2241;
		box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.14);
		border-radius: 10px;
		border: 1px solid rgba(0, 127, 255, 1);
		
		.content{
			color: #FFFFFF;
			font-weight: 400;
			font-size: 16px;
			text-align: center;
			height: 84px;
			line-height: 84px;
		}
		
		.line{
			width: 260px;
			height: 1px;
			background: rgba(255,255,255,0.2);
		}
		
		.footer{
			text-align: center;
			height: 40px;
			
			.line{
				width: 1px;
				height: 26px;
				background: rgba(255,255,255,0.2);
			}
			.cancel{
				font-weight: 400;
				color: rgba(255,255,255,0.7);
				font-size: 14px;
			}
			.confirm{
				font-weight: 400;
				color: #00E0FF;
				font-size: 14px;
			}
		}
	}
	
	.close-box{
		padding-top: 20px;
		
		image{
			width: 28px;
			height: 28px;
		}
	}
	
	.container{
		.user-box{
			width: 100%;
			height: 170px;
			align-items: baseline;
			border-bottom: 1px solid #294D6B;
			
			.mobile{
				font-weight: 500;
				color: #FFFFFF;
				font-size: 20px;
				
				image{
					width: 60px;
					height: 20px;
					margin-left: 10px;
				}
			}
			.time{
				font-weight: 400;
				color: rgba(255,255,255,0.7);
				font-size: 12px;
				padding-top: 5px;
			}
			.tools{
				padding: 10px 0;
					
				.item{
					.label{
						font-weight: bold;
						color: #FFFCFC;
						font-size: 16px;
					}
					.label-sub{
						font-weight: 400;
						color: rgba(255,255,255,0.7);
						font-size: 12px;
						padding-top: 4px;
					}
				}
			}
		}
		.boxs{
			padding: 16px;
			
			.box{
				width: 100%;
				background: #1B2241;
				box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.24);
				border-radius: 10px;
				border: 1px solid #294D6B;
				
				.tools{
					margin: 20px 0 10px 0;
					
					image{
						width: 48px;
						height: 48px;
					}
					
					.label{
						font-weight: 400;
						color: rgba(255,255,255,0.7);
						font-size: 12px;
						padding-top: 4px;
					}
				}
				
				.fast-tools{
					padding-top: 20px;
					
					image{
						width: 24px;
						height: 24px;
					}
					
					.label{
						font-weight: 400;
						color: rgba(255,255,255,0.7);
						font-size: 12px;
						padding-top: 8px;
					}
				}
			}
		}
	}
</style>
