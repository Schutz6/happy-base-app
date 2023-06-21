<template>
	<view class="width-max height-max">
		<uni-nav-bar backgroundColor="transparent" title="实名认证" dark status-bar fixed :border="false" height="44px" :leftWidth="60" :rightWidth="60">
			<block slot="left">
				<image @tap="back()" src="@/static/index/icon-left.png" style="height: 16px;width: 16px;"></image>
			</block>
		</uni-nav-bar>
		<view class="container">
			<view class="d-flex-center flex-column">
				<image src="@/static/me/logo.png" style="width: 66px;height: 40px;padding: 20px 0;"></image>
				<view class="color-white">
					<view v-if="user.certified == 0">未认证</view>
					<view v-else-if="user.certified == 1">已认证</view>
					<view v-else-if="user.certified == 2">审核中</view>
					<view v-else-if="user.certified == 3">认证失败</view>
				</view>
			</view>
			<view class="form">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top" label-width="210">
					<uni-forms-item name="full_name">
						<template v-slot:label>
							<view class="label">姓名</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.full_name" placeholder="请输入真实姓名" />
						<view class="tips">姓名需与提现户名相同</view>
					</uni-forms-item>
					<uni-forms-item name="id_number">
						<template v-slot:label>
							<view class="label">身份证号</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.id_number" placeholder="请输入身份证号" />
					</uni-forms-item>
				</uni-forms>
				<view class="d-flex-center" style="margin-top: 50px;" v-if="user.certified == 0 || user.certified == 3">
					<view class="btn d-flex-center" @click="submitForm">提交</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { navigateBack } from '@/utils/util'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				loading: false,
				formData: {
					full_name: null,
					id_number: null
				},
				rules: {
					full_name: {
						rules: [
							{ required: true, errorMessage: "请输入" }
						]
					},
					id_number: {
						rules: [
							{ required: true, errorMessage: "请输入" }
						]
					}
				},
				styles: {
					color: '#fff',
					backgroundColor: 'transparent',
					padding: '5px 10px'
				},
				placeholderStyle: "font-size:14px;color: #999;",
			}
		},
		computed: {
		    ...mapGetters(['user'])
		},
		onLoad() {
			this.$store.dispatch('getUserInfo').then(res => {
				this.formData.full_name = this.user.full_name
				this.formData.id_number = this.user.id_number
			})
		},
		methods: {
			back(){
				navigateBack()
			},
			//提交
			submitForm(){
				this.$refs.form.validate().then(res=>{
					if(!this.loading){
						this.loading = true
						this.$api.post("/user/realname/", this.formData).then(res => {
							this.loading = false
							if(res.code == 20000){
								uni.showToast({
									title: "提交成功",
									icon: 'success'
								});
								//更新用户信息
								this.user.certified = 2
								this.user.full_name = this.formData.full_name
								this.user.id_number = this.formData.id_number
								this.$store.commit('setUser', this.user)
								setTimeout(()=>{
									this.back()
								}, 1500)
							}else{
								uni.showToast({
									title: "提交失败",
									icon: 'error'
								});
							}
						})
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.container{
		padding: 20px 16px;
		
		.form{
			.label{
				font-size: 16px;
				color: #fff;
				font-weight: 500;
				padding: 20px 0 10px 0;
			}
			
			.tips{
				font-size: 12px;
				color: #fff;
				padding: 5px 0 0 0;
			}
			
			.btn{
				width: 279px;
				height: 44px;
				background: linear-gradient(256deg, #007FFF 0%, #00E0FF 100%);
				border-radius: 10px;
				color: #fff;
			}
		}
	}
</style>
