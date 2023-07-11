<template>
	<view class="page overflow-hidden" style="background-color: #151A2F;">
		<view class="content">
			<view class="form">
				<view class="box">
					<view>可提现余额</view>
					<view class="balance">{{user.balance || "0.00"}}</view>
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
					<view>1、提现手续费率{{params.withdrawalFee}}</view>
					<view>2、每次提现金额需是整数，不可带小数点</view>
					<view>3、最少提现为100元，最多提现为500000元</view>
				</view>
			</view>
			<view class="btns">
				<view class="d-flex-center btn btn1" @click="submitForm()">提现</view>
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
				bankList: [],//银行列表
				indexBank: 0,
				arrayBank: [],
				formData: {
					type: null,
					name: null,
					bank_name: null,
					branch_name: null,
					card_number: null,
					address_usdt: null,
					money: null,
					real_money: null,
					pay_password: null
				},
				rules: {
					type: {
						rules: [
							{ required: true, errorMessage: "请选择提现卡" }
						]
					},
					money: {
						rules: [{
								required: true,
								errorMessage: "请输入提现金额"
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
							{ required: true, errorMessage: "请输入支付密码" }
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
		onShow() {
			//获取用户信息
			this.$store.dispatch('getUserInfo')
		},
		onLoad() {
			//获取银行卡列表
			this.$api.post("/core/getList/", {"uid": this.user.id}, {"Mid": "Bankcard"}).then(res => {
				let list = []
				this.bankList = res.data
				for(let i=0;i<res.data.length;i++){
					let item = res.data[i]
					if(item.type == "1"){
						list.push({"value": i, "text": item.bank_name+" "+this.formatCardnumber(item.card_number)})
					}else if(item.type == "2"){
						list.push({"value": i, "text": "USDT "+this.formatCardnumber(item.address_usdt)})
					}
				}
				if(list.length>0){
					if(this.bankList[0].type == "1"){
						this.formData.type = "1"
						this.formData.name = this.bankList[0].name
						this.formData.bank_name = this.bankList[0].bank_name
						this.formData.branch_name = this.bankList[0].branch_name
						this.formData.card_number = this.bankList[0].card_number
					}else if(this.bankList[0].type == "2"){
						this.formData.type = "2"
						this.formData.address_usdt = this.bankList[0].address_usdt
					}
				}
				this.arrayBank = list
			})
		},
		methods: {
			//格式化银行卡
			formatCardnumber(card_number){
				if(card_number.length>8){
					return card_number.substr(0, 4)+" .... .... "+card_number.substr(-4)
				}
				return card_number 
			},
			//变更银行卡
			changeBank(e){
				this.indexBank = e.detail.value
				if(this.bankList[this.indexBank].type == "1"){
					this.formData.type = "1"
					this.formData.name = this.bankList[this.indexBank].name
					this.formData.bank_name = this.bankList[this.indexBank].bank_name
					this.formData.branch_name = this.bankList[this.indexBank].branch_name
					this.formData.card_number = this.bankList[this.indexBank].card_number
					this.formData.address_usdt = null
				}else if(this.bankList[this.indexBank].type == "2"){
					this.formData.type = "2"
					this.formData.name = null
					this.formData.bank_name = null
					this.formData.branch_name = null
					this.formData.card_number = null
					this.formData.address_usdt = this.bankList[this.indexBank].address_usdt
				}
			},
			//提交
			submitForm(){
				this.$refs.form.validate().then(res=>{
					if(!this.loading){
						this.loading = true
						this.$api.post("/user/withdraw/", this.formData).then(res => {
							this.loading = false
							if(res.code == 20000){
								uni.showToast({
									title: "成功，等待审核",
									icon: 'success'
								});
								//跳转到提现记录
								setTimeout(()=>{
									uni.redirectTo({
										url: '/pages/me/withdrawalRecords'
									});
								}, 500)
							}else if(res.code == 10006){
								uni.showToast({
									title: "支付密码错误",
									icon: 'error'
								});
							}else if(res.code == 11001){
								uni.showToast({
									title: "余额不足",
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
	.content{
		padding: 16px;
		
		.form{
			.box{
				color: #fff;
				background-image: url('../../static/login/box-bg.png');
				background-size: 100% 100%;
				height: 70px;
				padding: 20px;
				border-radius: 10px;
				
				.balance{
					font-size: 30px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					
					text{
						font-size: 20px;
						padding-right: 3px;
					}
				}
			}
			
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
	}
</style>
