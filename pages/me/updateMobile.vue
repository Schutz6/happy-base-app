<template>
	<view class="page overflow-hidden">
		<view class="content">
			<view class="form">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-width="0">
					<uni-forms-item name="mobile">
						<view class="item-left">
							<view class="item-code" @click="selectCode()">
								<view class="label">+{{formData.area}}</view>
								<uni-icons type="bottom" size="16" color="#A2AEC8"></uni-icons>
							</view>
							<input type="text" v-model="formData.mobile" style="color: #fff;padding: 10px;" placeholder-style="color:rgba(255, 255, 255, 0.7);font-size:14px;" placeholder="请输入手机号" />
						</view>
						<view class="line"></view>
					</uni-forms-item>
					<uni-forms-item name="code">
						<view class="item">
							<input type="text" v-model="formData.code" style="color: #fff;padding: 10px;" placeholder-style="color:rgba(255, 255, 255, 0.7);font-size:14px;" placeholder="请输入验证码" />
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
					area: '86',//区号
					mobile: '',
					code: ''
				},
				rules: {
					mobile: {
						rules: [{ required: true, errorMessage: "请输入手机号" }]
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
		onLoad() {
			//监听更新区号数据
			uni.$on('updateAreaData', this.updateAreaData)
		},
		onUnload(){
			//移除监听
			uni.$off('updateAreaData', this.updateAreaData)
		},
		methods: {
			//更新区号
			updateAreaData(data){
				this.formData.area = data.area
			},
			//选择区号
			selectCode(){
				uni.navigateTo({
					url: '/pages/common/code/code'
				});
			},
			//获取验证码
			getCode(){
				if(!this.formData.mobile){
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
					this.$api.post('/user/sendMobile/', {"type": 3, "area": this.formData.area, "mobile": this.formData.mobile}).then(res => {
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
						this.$api.post('/user/bindMobile/', this.formData).then(res => {
						  this.loading = false
						  if(res.code == 20000){
							  uni.showToast({
								title: "修改成功",
								icon: 'success'
							  })
							  this.user.area = this.formData.area
							  this.user.mobile = this.formData.mobile
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
								title: "手机已存在",
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
			padding: 0 20px;
			
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
