<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="实名认证" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="content">
				<view class="d-flex-center flex-column" style="background-color: #353535;border-radius: 10px;padding: 10px;">
					<view class="color-white fs14">
						<view v-if="user.certified == 0">待认证</view>
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
						</uni-forms-item>
						<uni-forms-item name="id_number">
							<template v-slot:label>
								<view class="label">身份证号</view>
							</template>
							<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.id_number" placeholder="请输入身份证号" />
						</uni-forms-item>
					</uni-forms>
					<view class="btns" v-if="user.certified == 0 || user.certified == 3">
						<view class="d-flex-center btn btn1" @click="submitForm()">提交</view>
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
					full_name: null,
					id_number: null
				},
				rules: {
					full_name: {
						rules: [
							{ required: true, errorMessage: "请输入真实姓名" }
						]
					},
					id_number: {
						rules: [
							{ required: true, errorMessage: "请输入身份证号" }
						]
					}
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
		onReady() {
			this.formData.full_name = this.user.full_name
			this.formData.id_number = this.user.id_number
			//查询审核结果
			this.$store.dispatch('getUserInfo')
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
								}, 500)
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
	.content{
		padding: 16px;
		background-color: #fff;
		
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
