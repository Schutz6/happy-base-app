<template>
	<view class="page overflow-hidden">
		<view class="content">
			<view class="form">
				<uni-forms ref="form" :modelValue="formData" :rules="rules">
					<uni-forms-item name="invite_code">
						<view class="item">
							<uni-easyinput trim="both" v-model="formData.invite_code" :styles="styles" placeholder="请输入邀请码"></uni-easyinput>
						</view>
					</uni-forms-item>
					<view class="btns">
						<view class="d-flex-center btn btn1" @click="submit()">绑定</view>
					</view>
				</uni-forms>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				loading: false,
				formData: {
					invite_code: null
				},
				rules: {
					invite_code: {
						rules: [{
							required: true,
							errorMessage: "请输入邀请码"
						}]
					},
				},
				styles: {
					color: '#fff',
					backgroundColor: 'transparent'
				},
			}
		},
		computed: {
			...mapGetters(['user'])
		},
		methods: {
			submit(){
				this.$refs.form.validate().then(res=>{
					if(!this.loading){
						uni.showLoading({
							title: "正在绑定"
						})
						this.loading = true
						this.$api.post("/user/bindInviteCode/", this.formData).then(res => {
							this.loading = false
							uni.hideLoading()
							if(res.code == 20000){
								uni.showToast({
									title: "绑定成功",
									icon: 'success'
								})
								this.user.pid = parseInt(this.formData.invite_code)
								this.$store.commit('setUser', this.user)
								setTimeout(()=>{
									uni.navigateBack()
								}, 500)
							}else{
								uni.showToast({
									title: "绑定失败",
									icon: 'error'
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		padding: 16px;
		
		.form{
			.item{
				padding: 10px 0;
			}
		}
		
		.btns{
			padding: 30px 0;
		}
	}
</style>
