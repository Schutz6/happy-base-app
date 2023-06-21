<template>
	<view class="width-max height-max">
		<uni-nav-bar backgroundColor="transparent" title="提现" dark status-bar fixed :border="false" height="44px" :leftWidth="60" :rightWidth="60">
			<block slot="left">
				<image @tap="back()" src="@/static/index/icon-left.png" style="height: 16px;width: 16px;"></image>
			</block>
		</uni-nav-bar>
		<view class="container">
			<view class="form">
				<view class="box">
					<view style="color: #fff;font-size: 14px;">可提现余额</view>
					<view style="font-weight: 500;color: #FFFCFC;font-size:40px;">{{user.balance}}</view>
					<view class="d-flex between" style="padding-top: 20px;">
						<view style="color: #fff;font-size: 14px;">可提现额度</view>
						<view style="color: #fff;font-size:20px;">{{user.withdrawal_limit}}</view>
					</view>
				</view>
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top" label-width="210">
					<uni-forms-item name="type">
						<template v-slot:label>
							<view class="label">提现卡</view>
						</template>
						<view class="input-box">
							<picker v-if="arrayBank.length>0" @change="changeBank" :value="indexBank" :range="arrayBank" range-key="text">
								<view class="d-flex between">
									<view class="address">{{arrayBank[indexBank].text}}</view>
									<image src="@/static/login/icon-down.png"></image>
								</view>
							</picker>
						</view>
					</uni-forms-item>
					<uni-forms-item name="money">
						<template v-slot:label>
							<view class="label">提现金额</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.money" @input="inputMoney" placeholder="请输入提现金额" />
					</uni-forms-item>
					<uni-forms-item name="real_money">
						<template v-slot:label>
							<view class="label">实际提现</view>
						</template>
						<uni-easyinput type="text" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.real_money" disabled placeholder="实际提现金额" />
					</uni-forms-item>
					<uni-forms-item name="pay_password">
						<template v-slot:label>
							<view class="label">交易密码</view>
						</template>
						<uni-easyinput type="password" :styles="styles" :placeholderStyle="placeholderStyle" v-model="formData.pay_password" placeholder="请输入支付密码" />
					</uni-forms-item>
				</uni-forms>
				<view style="color: rgba(255,255,255,0.7);font-size: 14px;padding: 20px 0;">
					<view>提现规则：</view>
					<view>1、每天最高可提现一次；</view>
					<view>2、每次提现金额需是整数，不可带小数点；</view>
					<view>3、最少提现为100元，最多提现为500000元。</view>
				</view>
				<view class="d-flex-center" style="margin-top: 50px;">
					<view class="btn d-flex-center" @click="submitForm">提现</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { navigateBack } from '@/utils/util'
	export default {
		data() {
			return {
				loading: false,
				bankList: [],//银行列表
				indexBank: 0,
				arrayBank: [],
				formData: {
					type: 0,
					name: null,
					bank_name: null,
					branch_name: null,
					card_number: null,
					address: null,
					money: null,
					real_money: null,
					pay_password: null
				},
				rules: {
					money: {
						rules: [{
								required: true,
								errorMessage: "请输入"
							},
							{
								validateFunction: (rule, value, data, callback) => {
									if (this.formData.money < 100) {
										callback('最少提现100')
									}else if(this.formData.money > 500000){
										callback('最多提现500000')
									}
									return true
								}
							}
						]
					},
					pay_password: {
						rules: [
							{ required: true, errorMessage: "请输入" }
						]
					},
				},
				styles: {
					color: '#fff',
					backgroundColor: 'transparent',
					disableColor: 'transparent'
				},
				placeholderStyle: "font-size:14px;color: #999;",
			}
		},
		computed: {
		    ...mapGetters(['user', 'params'])
		},
		onLoad() {
			//获取银行卡列表
			this.$api.post("/bankcard/list/", {"currentPage": 1, "pageSize": 100}).then(res => {
				let list = []
				this.bankList = res.data.results
				for(let i=0;i<res.data.results.length;i++){
					let item = res.data.results[i]
					if(item.type == 1){
						list.push({"value": i, "text": item.bank_name+" "+item.card_number})
					}else if(item.type == 2){
						list.push({"value": i, "text": "USDT "+item.address})
					}
				}
				if(list.length>0){
					if(this.bankList[0].type == 1){
						this.formData.type = 1
						this.formData.name = this.bankList[0].name
						this.formData.bank_name = this.bankList[0].bank_name
						this.formData.branch_name = this.bankList[0].branch_name
						this.formData.card_number = this.bankList[0].card_number
					}else if(this.bankList[0].type == 2){
						this.formData.type = 2
						this.formData.address = this.bankList[0].address
					}
				}
				this.arrayBank = list
			})
		},
		methods: {
			back(){
				navigateBack()
			},
			//变更银行卡
			changeBank(e){
				this.indexBank = e.detail.value
				if(this.bankList[this.indexBank].type == 1){
					this.formData.type = 1
					this.formData.name = this.bankList[this.indexBank].name
					this.formData.bank_name = this.bankList[this.indexBank].bank_name
					this.formData.branch_name = this.bankList[this.indexBank].branch_name
					this.formData.card_number = this.bankList[this.indexBank].card_number
					this.formData.address = null
				}else if(this.bankList[this.indexBank].type == 2){
					this.formData.type = 2
					this.formData.name = null
					this.formData.bank_name = null
					this.formData.branch_name = null
					this.formData.card_number = null
					this.formData.address = this.bankList[this.indexBank].address
				}
			},
			//提交
			submitForm(){
				this.$refs.form.validate().then(res=>{
					if(!this.loading){
						this.loading = true
						this.$api.post("/withdrawal/add/", this.formData).then(res => {
							this.loading = false
							if(res.code == 20000){
								uni.showToast({
									title: "提现成功",
									icon: 'success'
								});
								//跳转到提现记录
								setTimeout(()=>{
									uni.redirectTo({
										url: '/pages/me/withdrawalRecords'
									});
								}, 1500)
							}else if(res.code == 10006){
								uni.showToast({
									title: "密码错误",
									icon: 'error'
								});
							}else if(res.code == 11001){
								uni.showToast({
									title: "余额不足",
									icon: 'error'
								});
							}else if(res.code == 11005){
								uni.showToast({
									title: "24小时后操作",
									icon: 'error'
								});
							}else if(res.code == 11006){
								uni.showToast({
									title: "请先认证",
									icon: 'error'
								});
							}else{
								uni.showToast({
									title: "提现失败",
									icon: 'error'
								});
							}
						})
					}
				})
			},
			//输入金额
			inputMoney(money){
				this.formData.real_money = money - money*parseFloat(this.params.withdrawalFee)
			}
		}
	}
</script>

<style scoped lang="scss">
	.container{
		padding: 20px 16px;
		
		.form{
			.box{
				background-image: url(../../static/bank/box-bg.png);
				background-size: 100% 100%;
				border-radius: 6px;
				height: 120px;
				padding: 20px;
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
			
			.input-box{
				color: #fff;
				font-size: 16px;
				border: 1px solid #ddd;
				border-radius: 5px;
				padding: 10px;
				
				.address{
					overflow:hidden;
					text-overflow:ellipsis;
					white-space:nowrap;
				}
				
				image{
					width: 24px;
					height: 24px;
				}
			}
		}
	}
</style>
