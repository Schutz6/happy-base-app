<template>
	<view class="page overflow-hidden" style="background-color: #151A2F;">
		<view class="content">
			<view class="form">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-width="0">
					<uni-forms-item name="email">
						<input type="text" v-model="formData.email" style="color: #fff;padding: 10px;" placeholder="请输入邮箱" placeholder-style="color:rgba(255, 255, 255, 0.7);font-size:14px;" />
						<view class="line"></view>
					</uni-forms-item>
					<uni-forms-item name="code">
						<view class="item">
							<input type="text" v-model="formData.code" style="color: #fff;padding: 10px;" placeholder="请输入验证码" placeholder-style="color:rgba(255, 255, 255, 0.7);font-size:14px;" />
							<view class="get-code" @click="getCode()">{{showCode?count+"s后重新获取":"获取验证码"}}</view>
						</view>
						<view class="line"></view>
					</uni-forms-item>
				</uni-forms>
				<view class="btns">
					<view class="d-flex-center btn btn1" @click="submit()">修改</view>
				</view>
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
					email: null,
					code: null
				},
				rules: {
					email: {
						rules: [{ required: true, errorMessage: "请输入邮箱" }]
					},
					code: {
						rules: [{ required: true, errorMessage: "请输入验证码" }]
					}
				},
				showCode: false,
				count: null,
				timer: null,
			}
		},
		computed: {
			...mapGetters(['user'])
		},
		methods: {
			//获取验证码
			getCode(){
				if(!this.formData.email){
					return
				}
				const TIME_COUNT = 120;
				if (!this.timer) {
					this.count = TIME_COUNT;
					this.showCode = true
					this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= TIME_COUNT) {
							this.count--;
						} else {
							this.showCode = false;
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000)
					//调用发送接口
					this.$api.post('/user/sendEmail/', {"email": this.formData.email}).then(res => {
					  if(res.code == 20000){
						  uni.showToast({
							title: "发送成功",
							icon: 'success'
						  })
					  }else{
						  uni.showToast({
							title: "发送失败",
							icon: 'error'
						  });
					  }
					})
				}
			},
			submit(){
				this.$refs.form.validate().then(res=>{
					if(!this.loading){
						uni.showLoading({
							title: "正在修改"
						});
						this.loading = true
						this.$api.post('/user/bindEmail/', this.formData).then(res => {
						  this.loading = false
						  if(res.code == 20000){
							  uni.showToast({
								title: "修改成功",
								icon: 'success'
							  })
							  this.user.email = this.formData.email
							  this.$store.commit('setUser', this.user)
							  setTimeout(()=>{
							  	uni.navigateBack()
							  }, 500)
						  }else if(res.code == 10003){
							  uni.showToast({
								title: "验证码错误",
								icon: 'error'
							  });
						  }else if(res.code == 10004){
							  uni.showToast({
								title: "邮箱已存在",
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
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		.form{
			padding: 16px;
			
			.item-left{
				display: flex;
				align-items: center;
				
				.item-code{
					display: flex;
					align-items: center;
					color: #fff;
					
					.label{
						padding-left: 10px;
						padding-right: 5px;
					}
				}
			}
				
			.item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-top: 10px;
				
				.get-code{
					color: #fff;
					font-size: 12px;
					border: 1px solid #ddd;
					padding: 5px 10px;
					border-radius: 20px;
				}
			}
			
			.line{
				width: 100%;
				margin: 0 auto;
				height: 1px;
				background-color: #66666661;
			}
			
		}
		
		.btns{
			padding: 30px 0;
		}
	}
</style>
