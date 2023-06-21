<template>
	<view class="width-max height-max">
		<uni-nav-bar backgroundColor="transparent" title="新增提现卡" dark status-bar fixed :border="false" height="44px" :leftWidth="60" :rightWidth="60">
			<block slot="left">
				<image @tap="back()" src="@/static/index/icon-left.png" style="height: 16px;width: 16px;"></image>
			</block>
		</uni-nav-bar>
		<view class="container">
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
					<uni-forms-item name="name" v-if="indexType==0">
						<template v-slot:label>
							<view class="label">户名</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.name" placeholder="请输入户名" />
						<view class="tips">姓名需与实名认证资料相同</view>
					</uni-forms-item>
					<uni-forms-item name="bank_name" v-if="indexType==0">
						<template v-slot:label>
							<view class="label">银行名称</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.bank_name" placeholder="请输入银行名称" />
					</uni-forms-item>
					<uni-forms-item name="branch_name" v-if="indexType==0">
						<template v-slot:label>
							<view class="label">分行名称</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.branch_name" placeholder="请输入分行名称" />
					</uni-forms-item>
					<uni-forms-item name="card_number" v-if="indexType==0">
						<template v-slot:label>
							<view class="label">卡号</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.card_number" placeholder="请输入卡号" />
					</uni-forms-item>
					<uni-forms-item name="address" v-if="indexType==1">
						<template v-slot:label>
							<view class="label">USDT地址</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.address" placeholder="请输入USDT地址" />
					</uni-forms-item>
				</uni-forms>
				<view class="d-flex-center" style="margin-top: 50px;">
					<view class="btn d-flex-center" @click="submitForm">确定绑定</view>
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
				indexType: 0,
				arrayType: [{"value": 1, "text": "银行卡"}, {"value": 2, "text": "USDT-Trc20"}],
				formData: {
					type: 1,
					name: null,
					bank_name: null,
					branch_name: null,
					card_number: null,
					address: null
				},
				rules: {
					name: {
						rules: [
							{ required: true, errorMessage: "请输入" }
						]
					},
					bank_name: {
						rules: [
							{ required: true, errorMessage: "请输入" }
						]
					},
					branch_name: {
						rules: [
							{ required: true, errorMessage: "请输入" }
						]
					},
					card_number: {
						rules: [
							{ required: true, errorMessage: "请输入" }
						]
					},
					address: {
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
		methods: {
			back(){
				navigateBack()
			},
			//更改类型
			changeType(e){
				this.indexType = e.detail.value
				if(this.indexType == 0){
					this.formData.type = 1
					this.formData.address = null
				}else if(this.indexType == 1){
					this.formData.type = 2
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
						this.$api.post("/bankcard/add/", this.formData).then(res => {
							this.loading = false
							if(res.code == 20000){
								uni.showToast({
									title: "绑定成功",
									icon: 'success'
								});
								setTimeout(()=>{
									this.back()
								}, 1500)
							}else{
								uni.showToast({
									title: "绑定失败",
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
			.input-box{
				color: #fff;
				font-size: 16px;
				border: 1px solid #ddd;
				border-radius: 5px;
				padding: 10px;
				
				image{
					width: 24px;
					height: 24px;
				}
			}
		}
	}
</style>
