<template>
	<view class="width-max height-max">
		<uni-nav-bar backgroundColor="transparent" title="修改登录密码" dark status-bar fixed :border="false" height="44px" :leftWidth="60" :rightWidth="60">
			<block slot="left">
				<image @tap="back()" src="@/static/index/icon-left.png" style="height: 16px;width: 16px;"></image>
			</block>
		</uni-nav-bar>
		<view class="container">
			<view class="form">
				<view class="box d-flex">
					<image src="@/static/me/tips.png" style="width: 20px;height: 20px;"></image>
					<view style="color: #fff;font-size: 14px;padding-left: 10px;">密码修改后24小时内不得进行提现</view>
				</view>
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top" label-width="210">
					<uni-forms-item name="oldPassword">
						<template v-slot:label>
							<view class="label">原密码</view>
						</template>
						<uni-easyinput type="password" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.oldPassword" placeholder="请输入原密码" />
					</uni-forms-item>
					<uni-forms-item name="newPassword">
						<template v-slot:label>
							<view class="label">新密码</view>
						</template>
						<uni-easyinput type="password" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.newPassword" placeholder="请输入新密码" />
					</uni-forms-item>
					<uni-forms-item name="okpassword">
						<template v-slot:label>
							<view class="label">确认密码</view>
						</template>
						<uni-easyinput type="password" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.okpassword" placeholder="请再次确认密码" />
					</uni-forms-item>
				</uni-forms>
				<view class="d-flex-center" style="margin-top: 50px;">
					<view class="btn d-flex-center" @click="submitForm">设置</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { navigateBack } from '@/utils/util'
	export default {
		data() {
			return {
				loading: false,
				formData: {
					type: 1,//修改登录密码
					oldPassword: null,
					newPassword: null,
					okpassword: null,
				},
				rules: {
					oldPassword: {
						rules: [
							{ required: true, errorMessage: "请输入" }
						]
					},
					newPassword: {
						rules: [
							{ required: true, errorMessage: "请输入" }
						]
					},
					okpassword: {
						rules: [{
								required: true,
								errorMessage: "请输入"
							},
							{
								validateFunction: (rule, value, data, callback) => {
									if (this.formData.newPassword != value) {
										callback('密码不一致')
									}
									return true
								}
							}
						]
					},
				},
				styles: {
					color: '#fff',
					backgroundColor: 'transparent'
				},
				placeholderStyle: "font-size:14px;color: #999;",
			}
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
						this.$api.post("/changePwd/", this.formData).then(res => {
							this.loading = false
							if(res.code == 20000){
								uni.showToast({
									title: "设置成功",
									icon: 'success'
								});
								setTimeout(()=>{
									this.back()
								}, 1500)
							}else{
								uni.showToast({
									title: "设置失败",
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
			.box{
				background: #215386;
				border-radius: 6px;
				padding: 10px;
			}
			
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
