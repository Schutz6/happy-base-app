<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<!-- <uni-nav-bar title="登录" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar> -->
		<!-- <scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}"> -->
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height+'px'}">
			<view class="login-box">
				<view class="logo">
					<image :src="params.logo"></image>
				</view>
				<view class="title">欢迎来到{{params.appName}}</view>
				<uni-forms ref="form" label-position="top" :border="false" :modelValue="loginForm" :rules="loginRules">
					<uni-forms-item name="username">
						<template v-slot:label>
							<view class="label">账号</view>
						</template>
						<view class="item d-flex">
							<uni-easyinput type="text" trim="both" prefixIcon="a" :styles="styles" :placeholderStyle="placeholderStyle" v-model="loginForm.username" :inputBorder="false" placeholder="请输入账号" />
						</view>
					</uni-forms-item>
					<view class="divider"></view>
					<uni-forms-item name="password">
						<template v-slot:label>
							<view class="label">密码</view>
						</template>
						<view class="item d-flex">
							<uni-easyinput type="password" trim="both" prefixIcon="a" :styles="styles" :placeholderStyle="placeholderStyle" v-model="loginForm.password" :inputBorder="false" placeholder="请输入密码" />
						</view>
					</uni-forms-item>
					<view class="divider"></view>
					<view class="d-flex end">
						<navigator url="/pages/common/forget/forget"><text class="forget">忘记密码?</text></navigator>
					</view>
				</uni-forms>
				<view class="btns">
					<view class="d-flex-center btn btn1" @click="handleLogin">登录</view>
					<navigator url="/pages/common/register/register" open-type="navigate">
						<view class="d-flex-center btn btn2">注册</view>
					</navigator>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { setToken } from '@/utils/auth'
	import { navigateBack } from '@/utils/util'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				width: 0,//屏幕宽度
				height: 0,//屏幕高度
				loading: false,
				loginForm: {
					username: '',
					password: ''
				},
				loginRules: {
					username: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					password: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					}
				},
				styles: {
					color: '#000',
					backgroundColor: 'transparent'
				},
				placeholderStyle: "font-size:16px;color: #999;",
			}
		},
		computed: {
			...mapGetters(['params'])
		},
		async onLoad() {
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
			
			let username = uni.getStorageSync("UserName")
			if(username){
				//初始化账号
				this.loginForm.username = username
			}
			//获取参数设置
			let resParam = await this.$api.getAsync("/param/getList/")
			if(resParam.code == 20000){
				this.$store.commit('setParams', resParam.data)
			}
		},
		methods: {
			//返回
			back(){
				navigateBack()
			},
			//登录
			handleLogin() {
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						//保存账号
						uni.setStorageSync("UserName", this.loginForm.username)
						this.loading = true
						uni.showLoading({
							title: '正在登录',
							mask: true
						})
						this.$api.post("/login/", this.loginForm).then(res => {
							this.loading = false
							uni.hideLoading()
							if (res.code == 20000) {
								//令牌token
								setToken(res.data.token)
								uni.showToast({
									title: "登录成功",
									icon: 'success'
								})
								//获取用户信息
								this.$store.dispatch('getUserInfo').then(res => {
									//判断是否有权限
									if(res.code == 20000){
										//返回
										setTimeout(()=>{
											this.back()
										}, 500)
									}
								})
							} else if (res.code == 10005) {
								uni.showToast({
									title: "账号错误",
									icon: 'error'
								})
							} else if (res.code == 10006) {
								uni.showToast({
									title: "密码错误",
									icon: 'error'
								})
							} else if (res.code == 100061) {
								uni.showToast({
									title: "账号已锁定",
									icon: 'error'
								})
							} else {
								uni.showToast({
									title: "登录失败",
									icon: 'error'
								})
							}
						})
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.login-box{
		padding: 44px 48px 0 48px;
		
		.logo{
			image{
				width: 147px;
				height: 28px;
			}
		}
		
		.title{
			color: #000;
			font-size: 24px;
			padding-top: 8px;
			padding-bottom: 48px;
		}
		
		.divider{
			width: 100%;
			height: 1px;
			background: rgba(0,0,0,0.2);
		}
		
		.forget{
			color: #0062cc;
			font-size: 14px;
		}
		
		.label{
			font-size: 20px;
			font-weight: 600;
			color: #000;
			padding: 20px 0 10px 0;
		}
		
		.item{
			.area-code{
				color: #000;
				font-size: 16px;
				
				image{
					width: 24px;
					height: 24px;
				}
			}
		}
		
		.btns{
			padding-top: 50px;
			
			.btn{
				height: 44px;
				border-radius: 10px;
				color: #fff;
				font-size: 16px;
				margin-bottom: 20px;
			}
			.btn1{
				background: linear-gradient(256deg, #007FFF 0%, #00E0FF 100%);
			}
			.btn2{
				background: rgba(0,0,0,0.2);
			}
		}
	}
</style>
