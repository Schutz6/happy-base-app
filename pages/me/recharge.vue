<template>
	<view class="page overflow-hidden">
		<view class="content">
			<view class="box">
				<view>余额</view>
				<view class="balance">{{user.balance || "0.00"}}</view>
			</view>
			<view class="money-box">
				<uni-row :gutter="20">
					<uni-col :span="8">
						<view class="item" :class="money==30?'active':''" @click="changeMoney(30)">30</view>
					</uni-col>
					<uni-col :span="8">
						<view class="item" :class="money==50?'active':''" @click="changeMoney(50)">50</view>
					</uni-col>
					<uni-col :span="8">
						<view class="item" :class="money==100?'active':''" @click="changeMoney(100)">100</view>
					</uni-col>
					<uni-col :span="8">
						<view class="item" :class="money==300?'active':''" @click="changeMoney(300)">300</view>
					</uni-col>
					<uni-col :span="8">
						<view class="item" :class="money==500?'active':''" @click="changeMoney(500)">500</view>
					</uni-col>
					<uni-col :span="8">
						<view class="item" :class="money==1000?'active':''" @click="changeMoney(1000)">1000</view>
					</uni-col>
				</uni-row>
			</view>
			<view class="line-box">
				<view class="line"></view>
			</view>
			<view class="pay-box">
				<view class="item" @click="changePayType('alipay')">
					<view class="icon-item">
						<image src="@/static/recharge/alipay.png"></image>
						<view class="label">支付宝</view>
					</view>
					<image v-if="payType=='alipay'" src="@/static/recharge/checkbox-selected.png"></image>
					<image v-else src="@/static/recharge/checkbox.png"></image>
				</view>
				<view class="item" @click="changePayType('weixin')">
					<view class="icon-item">
						<image src="@/static/recharge/weixin.png"></image>
						<view class="label">微信</view>
					</view>
					<image v-if="payType=='weixin'" src="@/static/recharge/checkbox-selected.png"></image>
					<image v-else src="@/static/recharge/checkbox.png"></image>
				</view>
				<view class="item" @click="goPageByLogin('/pages/me/rechargeUsdt')">
					<view class="icon-item">
						<image src="@/static/recharge/usdt.png"></image>
						<view class="label">USDT</view>
					</view>
					<uni-icons type="right" size="20" color="#00000066"></uni-icons>
				</view>
			</view>
			<view class="btns">
				<view class="d-flex-center btn btn1" @click="recharge()">立即充值</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				money: 30,
				payType: "alipay"
			}
		},
		computed: {
			...mapGetters(['isLogin', 'user'])
		},
		onShow() {
			//获取用户信息
			this.$store.dispatch('getUserInfo')
		},
		methods: {
			//跳转页面（需登录）
			goPageByLogin(page){
				if(this.isLogin){
					uni.navigateTo({
						url: page
					});
				}else{
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},
			//选择钱
			changeMoney(money){
				this.money = money
			},
			//选择支付方式
			changePayType(payType){
				this.payType = payType
			},
			//充值
			recharge(){
				uni.showToast({
					title: "暂未开通",
					icon: 'error'
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		padding: 16px;
		
		.box{
			color: #fff;
			background-image: url('../../static/login/box-bg.png');
			background-size: 100% 100%;
			height: 70px;
			padding: 20px;
			border-radius: 10px;
			
			.balance{
				font-size: 30px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				
				text{
					font-size: 20px;
					padding-right: 3px;
				}
			}
		}
		.money-box{
			padding: 20px 10px;
			
			.item{
				color: #000;
				border: 1px solid #66666661;
				border-radius: 5px;
				text-align: center;
				padding: 15px 0;
				margin-bottom: 10px;
			}
			
			.active{
				border: 1px solid #007aff;
			}
		}
		
		.line-box{
			padding: 10px;
			
			.line{
				width: 100%;
				margin: 0 auto;
				height: 1px;
				background-color: #66666661;
			}
		}
		
		.pay-box{
			padding: 10px;
			
			.item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 15px 0;
				
				image{
					width: 26px;
					height: 26px;
				}
				
				.icon-item{
					color: #000;
					display: flex;
					align-items: center;
					
					image{
						width: 36px;
						height: 36px;
					}
					
					.label{
						padding-left: 10px;
					}
				}
			}
		}
		
		.btns{
			padding: 30px 0;
		}
	}
</style>
