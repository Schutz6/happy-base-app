<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="修改登录密码" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="content">
				<view class="form">
					<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top" label-width="210">
						<uni-forms-item name="oldPassword" v-if="user.has_password==1">
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
					<view class="btns">
						<view class="d-flex-center btn btn1" @click="submitForm()">修改</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { navigateBack } from '@/utils/util'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				width: 0,//屏幕宽度
				height: 0,//屏幕高度
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
							{ required: true, errorMessage: "请输入原密码" }
						]
					},
					newPassword: {
						rules: [
							{ required: true, errorMessage: "请输入新密码" }
						]
					},
					okpassword: {
						rules: [{
								required: true,
								errorMessage: "请输入确认密码"
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
					padding: '10px',
					color: '#000',
					backgroundColor: 'transparent'
				},
				placeholderStyle: "color:rgba(0, 0, 0, 0.7);font-size:14px;",
			}
		},
		computed: {
		    ...mapGetters(['user'])
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
			//提交
			submitForm(){
				this.$refs.form.validate().then(res=>{
					if(!this.loading){
						this.loading = true
						this.$api.post("/changePwd/", this.formData).then(res => {
							this.loading = false
							if(res.code == 20000){
								uni.showToast({
									title: "修改成功",
									icon: 'success'
								});
								this.user.has_password = 1
								this.$store.commit('setUser', this.user)
								setTimeout(()=>{
									this.back()
								}, 500)
							}else if(res.code == 10005){
								uni.showToast({
									title: "用户不存在",
									icon: 'error'
								});
							}else if(res.code == 10006){
								uni.showToast({
									title: "原密码错误",
									icon: 'error'
								});
							}else{
								uni.showToast({
									title: "修改失败",
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
	.content{
		padding: 16px;
		
		.form{
			.label{
				font-size: 14px;
				color: #000;
				padding: 20px 0 10px 0;
			}
		}
		
		.btns{
			padding: 30px 0;
		}
	}
</style>
