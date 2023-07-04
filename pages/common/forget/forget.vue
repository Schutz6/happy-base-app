<template>
	<view class="page overflow-hidden">
		<view class="content">
			<view class="nav">
				<view class="item" :class="type==1?'active':''" @click="changeType(1)">手机</view>
				<view class="item" :class="type==2?'active':''" @click="changeType(2)">邮箱</view>
			</view>
			<view class="box">
				<view class="form">
					<uni-forms ref="form" :modelValue="formData" :rules="rules" label-width="0">
						<uni-forms-item name="mobile" key="mobile" v-if="type==1">
							<view class="item-left">
								<view class="item-code" @click="selectCode()">
									<view class="label">+{{formData.area}}</view>
									<uni-icons type="bottom" size="16" color="#A2AEC8"></uni-icons>
								</view>
								<input type="text" v-model="formData.mobile" :style="styles" :placeholderStyle="placeholderStyle" placeholder="请输入手机号" />
							</view>
							<view class="line"></view>
						</uni-forms-item>
						<uni-forms-item name="email" key="email" v-if="type==2">
							<view class="item">
								<input type="text" v-model="formData.email" :style="styles" :placeholderStyle="placeholderStyle" placeholder="请输入邮箱" />
							</view>
							<view class="line"></view>
						</uni-forms-item>
						<uni-forms-item name="code">
							<view class="item">
								<input type="text" v-model="formData.code" :style="styles" :placeholderStyle="placeholderStyle" placeholder="请输入验证码" />
								<view class="get-code" @click="getCode()">{{showCode?count+"s后重新获取": "获取验证码"}}</view>
							</view>
							<view class="line"></view>
						</uni-forms-item>
						<uni-forms-item name="password">
							<view class="item">
								<input type="password" v-model="formData.password" :style="styles" :placeholderStyle="placeholderStyle" placeholder="请输入新密码" />
							</view>
							<view class="line"></view>
						</uni-forms-item>
					</uni-forms>
					<view class="btns">
						<view class="d-flex-center btn btn1" @click="submit()">确定</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				showPassword: false,
				type: 1,
				formData: {
					area: '86',//区号
					mobile: null,
					email: null,
					code: null,
					password: null
				},
				rules: {
					mobile: {
						rules: [{ required: true, errorMessage: "请输入手机号" }]
					},
					email: {
						rules: [{ required: true, errorMessage: "请输入邮箱" }]
					},
					code: {
						rules: [{ required: true, errorMessage: "请输入验证码" }]
					},
					password: {
						rules: [{ required: true, errorMessage: "请输入新密码" }]
					}
				},
				showCode: false,
				count: null,
				timer: null,
				styles: {
					padding: '10px',
					color: '#fff',
					backgroundColor: 'transparent'
				},
				placeholderStyle: "color:rgba(255, 255, 255, 0.7);font-size:14px;",
			}
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
			changeType(type){
				this.type = type
				//移除校验
				this.$refs.form.clearValidate()
			},
			//确定
			submit(){
				this.$refs.form.validate().then(res=>{
					if(!this.loading){
						uni.showLoading({
							title: "正在修改"
						});
						this.loading = true
						if(this.type == 1){
							this.formData.email = null
						}else if(this.type == 2){
							this.formData.mobile = null
						}
						this.$api.post("/user/replacePassword/", this.formData).then(res => {
							this.loading = false
							uni.hideLoading();
							if(res.code == 20000){
								uni.showToast({
									title: "修改成功",
									icon: 'success'
								});
								setTimeout(()=>{
									uni.navigateBack()
								}, 500)
							}else if(res.code == 10003){
								uni.showToast({
									title: "验证码错误",
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
			//选择区号
			selectCode(){
				uni.navigateTo({
					url: '/pages/common/code/code'
				});
			},
			//获取验证码
			getCode(){
				if(this.type == 1){
					//手机号
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
				}else if(this.type == 2){
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
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		.nav{
			display: flex;
			padding: 20px;
			width: 260px;
			margin: 0 auto;
			
			.item{
				color: rgba(255,255,255,0.7);
				text-align: center;
				flex: 1
			}
			.active{
				color: #007FFF;
			}
		}
		
		.box{
			border: 1px solid #294D6B;
			border-top-left-radius: 15px;
			border-top-right-radius: 15px;
			border-bottom-width: 0px;
			border-left-width: 0px;
			border-right-width: 0px;
			padding: 15px 0 0 0;
		}
		
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
