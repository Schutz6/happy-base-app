<template>
	<view class="page overflow-hidden">
		<view class="content">
			<view class="form">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top" label-width="210">
					<uni-forms-item name="type">
						<template v-slot:label>
							<view class="label">卡片类型</view>
						</template>
						<view class="input-box">
							<picker v-if="arrayType.length>0" @change="changeType" :value="indexType" :range="arrayType" range-key="text">
								<view class="d-flex between">
									<view>{{arrayType[indexType].text}}</view>
									<image src="@/static/login/icon-down.png"></image>
								</view>
							</picker>
						</view>
					</uni-forms-item>
					<uni-forms-item name="name" key="name" v-if="indexType==0">
						<template v-slot:label>
							<view class="label">户名</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.name" placeholder="请输入户名" />
					</uni-forms-item>
					<uni-forms-item name="bank_name" key="bank_name" v-if="indexType==0">
						<template v-slot:label>
							<view class="label">银行名称</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.bank_name" placeholder="请输入银行名称" />
					</uni-forms-item>
					<uni-forms-item name="branch_name" key="branch_name" v-if="indexType==0">
						<template v-slot:label>
							<view class="label">分行名称</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.branch_name" placeholder="请输入分行名称" />
					</uni-forms-item>
					<uni-forms-item name="card_number" key="card_number" v-if="indexType==0">
						<template v-slot:label>
							<view class="label">卡号</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.card_number" placeholder="请输入卡号" />
					</uni-forms-item>
					<uni-forms-item name="address_usdt" key="address_usdt" v-if="indexType==1">
						<template v-slot:label>
							<view class="label">USDT地址</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.address_usdt" placeholder="请输入USDT地址" />
					</uni-forms-item>
				</uni-forms>
				<view class="btns">
					<view class="d-flex-center btn btn1" @click="submitForm()">新增</view>
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
				indexType: 0,
				arrayType: [{"value": "1", "text": "银行卡"}, {"value": "2", "text": "USDT-Trc20"}],
				formData: {
					type: "1",
					name: null,
					bank_name: null,
					branch_name: null,
					card_number: null,
					address_usdt: null
				},
				rules: {
					name: {
						rules: [
							{ required: true, errorMessage: "请输入户名" }
						]
					},
					bank_name: {
						rules: [
							{ required: true, errorMessage: "请输入银行名称" }
						]
					},
					branch_name: {
						rules: [
							{ required: true, errorMessage: "请输入分行名称" }
						]
					},
					card_number: {
						rules: [
							{ required: true, errorMessage: "请输入卡号" }
						]
					},
					address_usdt: {
						rules: [
							{ required: true, errorMessage: "请输入USDT地址" }
						]
					}
				},
				styles: {
					padding: '10px',
					color: '#fff',
					backgroundColor: 'transparent'
				},
				placeholderStyle: "color:rgba(255, 255, 255, 0.7);font-size:14px;",
			}
		},
		methods: {
			back(){
				navigateBack()
			},
			//更改类型
			changeType(e){
				this.indexType = e.detail.value
				if(this.indexType == 0){
					this.formData.type = "1"
					this.formData.address_usdt = null
				}else if(this.indexType == 1){
					this.formData.type = "2"
					this.formData.name = null
					this.formData.bank_name = null
					this.formData.branch_name = null
					this.formData.card_number = null
				}
			},
			//提交
			submitForm(){
				this.$refs.form.validate().then(res=>{
					if(!this.loading){
						this.loading = true
						uni.showLoading({
							title: '正在提交'
						})
						this.$api.post("/core/add/", this.formData, {"Mid": "Bankcard"}).then(res => {
							this.loading = false
							uni.hideLoading()
							if(res.code == 20000){
								uni.showToast({
									title: "新增成功",
									icon: 'success'
								});
								setTimeout(()=>{
									uni.navigateBack()
								}, 500)
							}else{
								uni.showToast({
									title: "新增失败",
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
				color: #fff;
				padding: 20px 0 10px 0;
			}
			
			.tips{
				font-size: 12px;
				color: #fff;
				padding: 5px 0 0 0;
			}
			
			.input-box{
				color: #fff;
				font-size: 14px;
				border: 1px solid #ddd;
				border-radius: 5px;
				padding: 5px 10px;
				
				image{
					width: 24px;
					height: 24px;
				}
			}
		}
		.btns{
			padding: 30px 0;
		}
	}
</style>
