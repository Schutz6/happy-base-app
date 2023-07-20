<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="注册" backgroundColor="transparent" status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#424357" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="login-box">
				<view style="background-color: #fff;padding: 20px;border-radius: 10px;">
					<uni-forms ref="form" label-position="top" :border="false" :modelValue="loginForm" :rules="loginRules">
						<uni-forms-item name="username">
							<template v-slot:label>
								<view class="label">账号</view>
							</template>
							<view class="item d-flex">
								<uni-easyinput type="text" trim="both" prefixIcon="a" :styles="styles" :placeholderStyle="placeholderStyle"
									v-model="loginForm.username" :inputBorder="false" placeholder="请输入账号" />
							</view>
						</uni-forms-item>
						<view class="divider"></view>
						<uni-forms-item name="password">
							<template v-slot:label>
								<view class="label">密码</view>
							</template>
							<view class="item d-flex">
								<uni-easyinput type="password" trim="both" prefixIcon="a" :styles="styles"
									:placeholderStyle="placeholderStyle" v-model="loginForm.password" :inputBorder="false"
									placeholder="请输入密码" />
							</view>
						</uni-forms-item>
						<view class="divider"></view>
						<uni-forms-item name="okpassword">
							<template v-slot:label>
								<view class="label">确认密码</view>
							</template>
							<view class="item d-flex">
								<uni-easyinput type="password" trim="both" prefixIcon="a" :styles="styles"
									:placeholderStyle="placeholderStyle" v-model="loginForm.okpassword" :inputBorder="false"
									placeholder="请确认密码" />
							</view>
						</uni-forms-item>
						<view class="divider"></view>
						<uni-forms-item name="invite_code" v-if="params.isInviteCode==='1'">
							<template v-slot:label>
								<view class="label">邀请码</view>
							</template>
							<view class="item d-flex">
								<uni-easyinput type="text" trim="both" prefixIcon="a" :styles="styles" :placeholderStyle="placeholderStyle"
									v-model="loginForm.invite_code" :inputBorder="false" placeholder="请输入邀请码" />
							</view>
						</uni-forms-item>
						<view class="divider" v-if="params.isInviteCode==='1'"></view>
					</uni-forms>
					<view class="btns">
						<view class="d-flex-center btn btn1" @click="handleLogin">立即注册</view>
						<navigator url="/pages/common/login/login" open-type="navigateBack">
							<!-- <view class="d-flex-center btn btn2">登录</view> -->
							<view style="color: #666666;font-size: 12px;text-align: center;">已有账号？<text style="color: #0888FF;">立即登录</text></view>
						</navigator>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { setToken, removeToken } from '@/utils/auth'
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
					password: '',
					okpassword: '',
					invite_code: ''
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
					},
					okpassword: {
						rules: [{
								required: true,
								errorMessage: "请输入"
							},
							{
								validateFunction: (rule, value, data, callback) => {
									if (this.loginForm.password != value) {
										callback('密码不一致')
									}
									return true
								}
							}
						]
					},
					invite_code: {
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
				indexAreaCode: 0,
				arrayAreaCode: [{"text": "+86", "value": "86"}]
			}
		},
		computed: {
			...mapGetters(['params'])
		},
		onLoad(options) {
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
			
			//查询是否有邀请码
			let invite_code = options.invite_code
			if(invite_code){
				this.loginForm.invite_code = invite_code
			}
			
			let username = uni.getStorageSync("UserName")
			if (username) {
				//初始化账号
				this.loginForm.username = username
			}
		},
		methods: {
			//返回
			back(){
				navigateBack()
			},
			//注册
			handleLogin() {
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						//保存账号
						uni.setStorageSync("UserName", this.loginForm.username)
						this.loading = true
						uni.showLoading({
							title: '正在注册',
							mask: true
						})
						this.$api.post("/user/register/", this.loginForm).then(res => {
							this.loading = false
							uni.hideLoading()
							if (res.code == 20000) {
								//令牌token
								setToken(res.data.token)
								uni.showToast({
									title: "注册成功",
									icon: 'success'
								})
								//获取用户信息
								this.$store.dispatch('getUserInfo').then(res => {
									if(res.code == 20000){
										//跳转首页
										setTimeout(()=>{
											uni.reLaunch({
												url: '/'
											});
										}, 1000)
									}
								})
							}else if (res.code == 10004) {
								uni.showToast({
									title: "账号已存在",
									icon: 'error'
								})
							}else if (res.code == 10031) {
								uni.showToast({
									title: "注册已达上限",
									icon: 'error'
								})
							} else {
								uni.showToast({
									title: "注册失败",
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
	.login-box {
		padding: 44px 48px 0 48px;

		.logo {
			image {
				width: 147px;
				height: 28px;
			}
		}

		.title {
			color: #333333;
			font-size: 20px;
			font-weight: bold;
			padding-top: 8px;
			padding-bottom: 30px;
		}

		.divider {
			width: 100%;
			height: 1px;
			background: rgba(0, 0, 0, 0.2);
		}

		.label {
			font-size: 16px;
			color: #000;
			padding: 20px 0 10px 0;
		}

		.item {
			.area-code {
				color: #000;
				font-size: 16px;

				image {
					width: 24px;
					height: 24px;
				}
			}
		}

		.btns {
			padding-top: 50px;

			.btn {
				height: 44px;
				border-radius: 22px;
				color: #fff;
				font-size: 16px;
				margin-bottom: 20px;
			}

			.btn1 {
				background: linear-gradient(256deg, #007FFF 0%, #00E0FF 100%);
			}

			.btn2 {
				background: rgba(0, 0, 0, 0.2);
			}
		}
	}
</style>