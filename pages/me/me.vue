<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<!-- <uni-nav-bar backgroundColor="transparent" dark status-bar :border="false" height="0px"></uni-nav-bar> -->
		<uni-nav-bar title="我的" backgroundColor="transparent" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px" style="position: absolute;z-index: 100;width: 100%;">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height+'px'}">
			<view class="container" v-if="user">
				<view class="user-box d-flex flex-column">
					<view class="d-flex width-max between">
						<view class="d-flex flex1" style="padding: 20px;">
							<image :src="user.avatar" style="width: 60px;height: 60px;border-radius: 30px;border: 2px solid #fff;"></image>
							<view class="d-flex flex1 flex-column" style="padding-left: 10px;align-items: baseline;">
								<view class="mobile d-flex">
									{{user.name}}
									<!-- <image :src="'../../static/me/certified'+user.certified+'.png'"></image> -->
								</view>
								<view class="time d-flex">
									<view>UID：{{user.id}}</view>
								</view>
							</view>
						</view>
						<!-- <view style="margin-right: 20px;">
							<uni-icons type="gear" size="28" color="#000" @tap="toPageLogin('/pages/me/setting')"></uni-icons>
						</view> -->
					</view>
					<view class="tools d-flex">
						<view class="item d-flex flex-column">
							<view class="label">{{0}}</view>
							<view class="label-sub">我的收藏</view>
						</view>
						<view class="item d-flex flex-column">
							<view class="label">{{0}}</view>
							<view class="label-sub">我的点赞</view>
						</view>
						<view class="item d-flex flex-column">
							<view class="label">{{0}}</view>
							<view class="label-sub">观看历史</view>
						</view>
					</view>
				</view>
				<view class="content">
					<view class="share-box">
						<view class="d-flex between" style="padding: 16px;">
							<view class="d-flex">
								<view class="d-flex flex-column" style="padding-right: 20px;align-items: flex-start;" @tap="toPageLogin('/pages/me/invite')">
									<view style="font-size: 20px;">分享<text style="color: #0888FF;">赚钱</text></view>
									<view style="font-size: 12px;padding-top: 5px;">推荐1人获得1金币</view>
								</view>
								<view class="line"></view>
								<view class="d-flex flex-column" style="padding-left: 20px;align-items: flex-start;">
									<view>我的金币</view>
									<view style="padding-top: 5px;">{{user.balance || '0'}}<text style="color: #999999;font-size: 12px;">金币</text></view>
								</view>
							</view>
							<view class="d-flex flex-column">
								<view class="d-flex-center btn-withdraw" @tap="toPageLogin('/pages/me/withdraw')">提现</view>
								<view style="height: 10px;"></view>
								<view class="d-flex-center btn-recharge" @tap="toPageLogin('/pages/me/recharge')">充值</view>
							</view>
						</view>
					</view>
					<view class="box d-flex">
						<view class="item d-flex flex-column flex1" @tap="toPageLogin('/pages/me/team')">
							<view style="color: #0888FF;font-size: 20px;font-weight: bold;">
								{{agentInfo.one_list.length+agentInfo.two_list.length+agentInfo.three_list.length}}
							</view>
							<view style="color: #333;font-size: 12px;font-weight: 400;">我的团队</view>
						</view>
						<view class="item d-flex flex-column flex1" @tap="toPageLogin('/pages/me/agent')">
							<view style="color: #0888FF;font-size: 20px;font-weight: bold;">
								{{agentInfo.one_income+agentInfo.two_income+agentInfo.three_income}}
							</view>
							<view style="color: #333;font-size: 12px;font-weight: 400;">累计收益</view>
						</view>
						<view class="item d-flex flex-column flex1">
							<view style="color: #000;font-size: 20px;font-weight: bold;">{{agentInfo.one_income}}</view>
							<view style="color: #333;font-size: 12px;font-weight: 400;">直推收益</view>
						</view>
						<!-- <view class="item d-flex flex-column flex1">
							<view style="color: #000;font-size: 20px;font-weight: bold;">
								{{agentInfo.one_income+agentInfo.two_income+agentInfo.three_income}}
							</view>
							<view style="color: #333;font-size: 12px;font-weight: 400;">团队收益</view>
						</view> -->
					</view>
					<view class="box">
						<view class="item d-flex between" @tap="toPageLogin('/pages/me/setting')">
							<view class="d-flex">
								<image src="@/static/me/icon-setting.png" style="width: 24px;height: 24px;"></image>
								<view style="font-size: 14px;font-weight: 400;color: #666666;padding-left: 10px;">设置</view>
							</view>
							<image src="@/static/me/icon-left.png" style="width: 6px;height: 10px;"></image>
						</view>
						<view class="line"></view>
						<view class="item d-flex between">
							<view class="d-flex">
								<image src="@/static/me/icon-feedback.png" style="width: 24px;height: 24px;"></image>
								<view style="font-size: 14px;font-weight: 400;color: #666666;padding-left: 10px;">意见反馈</view>
							</view>
							<image src="@/static/me/icon-left.png" style="width: 6px;height: 10px;"></image>
						</view>
						<view class="line"></view>
						<view class="item d-flex between" @tap="bindInvite()">
							<view class="d-flex">
								<image src="@/static/me/icon-code.png" style="width: 24px;height: 24px;"></image>
								<view style="font-size: 14px;font-weight: 400;color: #666666;padding-left: 10px;">绑定邀请码</view>
							</view>
							<image src="@/static/me/icon-left.png" style="width: 6px;height: 10px;"></image>
						</view>
						<view class="line"></view>
						<view class="item d-flex between" @tap="showDialog('contactDialog')">
							<view class="d-flex">
								<image src="@/static/me/icon-kefu.png" style="width: 24px;height: 24px;"></image>
								<view style="font-size: 14px;font-weight: 400;color: #666666;padding-left: 10px;">联系客服</view>
							</view>
							<image src="@/static/me/icon-left.png" style="width: 6px;height: 10px;"></image>
						</view>
					</view>
				</view>
				
				<!-- <view class="boxs">
					<view class="box">
						<view class="tools d-flex">
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/me/recharge')">
								<view class="icon d-flex-center"><image src="@/static/me/icon-recharge.png"></image></view>
								<view class="label">充值</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/me/withdraw')">
								<view class="icon d-flex-center"><image src="@/static/me/icon-withdraw.png"></image></view>
								<view class="label">提现</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/me/kefu')">
								<view class="icon d-flex-center"><image src="@/static/me/icon-kefu.png"></image></view>
								<view class="label">客服</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/me/invite')">
								<view class="icon d-flex-center"><image src="@/static/me/icon-invite.png"></image></view>
								<view class="label">邀请</view>
							</view>
						</view>
					</view>
					<view class="box">
						<view class="fast-tools d-flex">
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/me/rechargeRecords')">
								<image src="@/static/me/icon-03.png"></image>
								<view class="label">充值记录</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/me/withdrawRecords')">
								<image src="@/static/me/icon-04.png"></image>
								<view class="label">提现记录</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/me/realname')">
								<image src="@/static/me/icon-06.png"></image>
								<view class="label">实名认证</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/bank/bank')">
								<image src="@/static/me/icon-07.png"></image>
								<view class="label">绑定提现卡</view>
							</view>
						</view>
						<view class="fast-tools d-flex">
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/me/updatePassword')">
								<image src="@/static/me/icon-09.png"></image>
								<view class="label">修改登录密码</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/me/updatePayPassword')">
								<image src="@/static/me/icon-08.png"></image>
								<view class="label">修改支付密码</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/me/team')">
								<image src="@/static/me/icon-10.png"></image>
								<view class="label">我的团队</view>
							</view>
							<view class="flex1 d-flex flex-column" @tap="toPageLogin('/pages/me/agent')">
								<image src="@/static/me/icon-11.png"></image>
								<view class="label">代理收益</view>
							</view>
						</view>
					</view>
				</view> -->
			</view>
		</scroll-view>
		
		<uni-popup ref="contactDialog" type="center">
			<view class="dialog-box">
				<view class="head">联系客服</view>
				<view class="content">{{params.contact}}</view>
			</view>
		</uni-popup>
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
				agentInfo: {
					"one_list": [],
					"one_income": 0,
					"two_list": [],
					"two_income": 0,
				    "three_list": [],
					"three_income": 0
				}
			}
		},
		computed: {
		    ...mapGetters(['isLogin', 'user', 'params'])
		},
		filters: {
		    //格式化日期
		    formatDate(time){
		    	return formatDateUtc(time)
		    }
		},
		onShow() {
			this.$store.dispatch('getUserInfo')
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
			//显示弹出框
			showDialog(id){
				this.$refs[id].open()
			},
			//关闭弹出框
			hideDialog(id){
				this.$refs[id].close()
			},
			//初始化
			init(){
				//查询团队收益
				this.$api.get("/agent/team/").then(res => {
					if(res.code == 20000){
						this.agentInfo = res.data
					}
				})
			},
			//跳转（需登录）
			toPageLogin(page){
				if(this.isLogin){
					uni.navigateTo({
						url: page
					})
				}else{
					uni.reLaunch({
						url: '/pages/common/login/login'
					})
				}
			},
			//绑定邀请码
			bindInvite(){
				if(this.user.pid){
					uni.showToast({
						title: "已绑定",
						icon: 'error'
					})
				}else{
					uni.navigateTo({
						url: "/pages/me/bindInvite"
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.container{
		.user-box{
			width: 100%;
			height: 170px;
			align-items: baseline;
			border-bottom: 1px solid #ddd;
			background-image: url(../../static/me/me-top.png);
			background-size: 100% 100%;
			padding-top: 44px;
			
			.mobile{
				font-weight: 500;
				color: #fff;
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
				font-size: 14px;
				padding-top: 5px;
			}
			.tools{
				padding: 10px 0;
					
				.item{
					width: 100px;
					
					.label{
						font-weight: bold;
						color: #fff;
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
		.content{
			padding: 12px;
			
			.share-box{
				width: 100%;
				height: 94px;
				background-image: url(../../static/me/me-box.png);
				background-size: 100% 100%;
				color: #fff;
				
				.line{
					height: 52px;
					width: 1px;
					background-color: #fff;
					opacity: 0.2;
				}
				
				.btn-withdraw{
					width: 60px;
					height: 25px;
					border-radius: 20px;
					opacity: 1;
					border: 1px solid #FFFFFF;
					font-size: 12px;
				}
				.btn-recharge{
					width: 60px;
					height: 25px;
					border-radius: 20px;
					opacity: 1;
					background: linear-gradient(135deg, #589FFF 0%, #0888FF 100%);
					font-size: 12px;
				}
			}
			
			.box{
				background-color: #fff;
				border-radius: 10px;
				margin-top: 12px;
				
				.item{
					padding: 20px 10px;
				}
				
				.line{
					background: #0000001e;
					height: 1px;
					width: 95%;
					margin: 0 auto;
				}
			}
		}
		
		.boxs{
			padding: 16px;
			
			.box{
				margin-bottom: 16px;
				width: 100%;
				background: #1B2241;
				box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.24);
				border-radius: 10px;
				border: 1px solid #294D6B;
				
				.tools{
					margin: 16px 0;
					
					.icon{
						border: 0.5px solid #66666661;
						border-radius: 5px;
						padding: 5px;
						width: 30px;
						height: 30px;
					}
					image{
						width: 28px;
						height: 28px;
					}
					
					.label{
						font-weight: 400;
						color: rgba(255,255,255,0.7);
						font-size: 12px;
						padding-top: 4px;
					}
				}
				
				.fast-tools{
					padding-top: 16px;
					
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
				.fast-tools:last-child{
					padding-bottom: 16px;
				}
			}
		}
	}
</style>
