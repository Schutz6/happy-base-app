<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar backgroundColor="transparent" dark status-bar :border="false" height="0px"></uni-nav-bar>
		<!-- <uni-nav-bar title="我的" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar> -->
		<!-- <scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}"> -->
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height+'px'}">
			<view class="container" v-if="user">
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
							<uni-icons type="gear" size="28" color="#000" @click="toPageLogin('/pages/me/setting')"></uni-icons>
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
		},
		methods: {
			//返回
			back(){
				navigateBack()
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
			
			.mobile{
				font-weight: 500;
				color: #000;
				font-size: 20px;
				
				image{
					width: 60px;
					height: 20px;
					margin-left: 10px;
				}
			}
			.time{
				font-weight: 400;
				color: rgba(0,0,0,0.7);
				font-size: 12px;
				padding-top: 5px;
			}
			.tools{
				padding: 10px 0;
					
				.item{
					.label{
						font-weight: bold;
						color: #000;
						font-size: 16px;
					}
					.label-sub{
						font-weight: 400;
						color: rgba(0,0,0,0.7);
						font-size: 12px;
						padding-top: 4px;
					}
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
