<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="USDT充值" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="content">
				<view class="box">
					<uni-row :gutter="20">
						<uni-col :span="8">
							<view class="item" :class="formData.currency=='TRC20'?'active':''" @click="changeCurrency('TRC20')">TRC20</view>
						</uni-col>
						<uni-col :span="8">
							<view class="item" :class="formData.currency=='ERC20'?'active':''" @click="changeCurrency('ERC20')">ERC20</view>
						</uni-col>
						<uni-col :span="8">
							<view class="item" :class="formData.currency=='OMNI'?'active':''" @click="changeCurrency('OMNI')">OMNI</view>
						</uni-col>
					</uni-row>
				</view>
				<view class="tips">*该地址只能接收{{formData.currency}}_USDT的资产，充错将无法找回！</view>
				<view class="qrcode-box">
					<module-qrcode :qrPath.sync="qrPath" :text="text" :size="size" :quality="quality" :colorDark="colorDark" :colorLight="colorLight"></module-qrcode>
				</view>
				<view class="address">{{text}}</view>
				<view class="btns">
					<view class="d-flex-center btn btn1" @click="copy()">复制地址</view>
				</view>
				<view class="form">
					<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top" label-width="210">
						<uni-forms-item required name="money">
							<template v-slot:label>
								<view class="label">充值数量 USDT汇率：{{params.usdtRate}}</view>
							</template>
							<uni-easyinput type="text" v-model="formData.money" :styles="styles" :placeholderStyle="placeholderStyle" placeholder="请输入充值数量" />
						</uni-forms-item>
						<uni-forms-item label-width="110" required name="pic">
							<template v-slot:label>
								<view class="label">充值凭证</view>
							</template>
							<uni-file-picker 
								:disable-preview="false"
								:del-icon="true"
								:imageStyles="imageStyles"
								:limit="1"
								return-type="object"
								file-mediatype="image"
								@select="selectImg"
								@delete="deleteImg">
								<text style="color: #66666661;font-size: 30px;">+</text>
							</uni-file-picker>
						</uni-forms-item>
					</uni-forms>
				</view>
				<view class="btns">
					<view class="d-flex-center btn btn1" @click="submitForm()">立即提交</view>
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
				qrPath: '',
				text: '',
				size: 120,
				quality:'L',
				colorDark: '#000000',
				colorLight: '#ffffff',
				formData: {
					type: "2",
					currency: 'TRC20',
					money: null,
					address: null,
					pic: null
				},
				rules: {
					money: {
						rules: [
							{ required: true, errorMessage: "请输入数量" },
							{
								validateFunction: (rule, value, data, callback) => {
									if (parseFloat(value) <= 0) {
										callback("数量大于0")
										return false
									}
									return true
								}
							}
						]
					},
					pic: {
						rules: [{ required: true, errorMessage: "请上传凭证" }]
					}
				},
				imageStyles: {
					width: 124,
					height: 124,
					border: {
						radius: '5'
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
			...mapGetters(['params'])
		},
		onLoad() {
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
		},
		onReady() {
			this.text = this.params.trc20Address
		},
		methods: {
			//返回
			back(){
				navigateBack()
			},
			//选择币种
			changeCurrency(currency){
				this.formData.currency = currency
				if(currency === "ERC20"){
					this.text = this.params.erc20Address
				}else if(currency === "TRC20"){
					this.text = this.params.trc20Address
				}else if(currency === "OMNI"){
					this.text = this.params.omniAddress
				}
			},
			//复制
			copy(){
				uni.setClipboardData({
					data: this.text,
					success: ()=> {
						uni.showToast({
							title: "复制成功",
							icon: 'success'
						})
					},
					fail: ()=> {
						uni.showToast({
							title: "复制失败",
							icon: 'error'
						})
					}
				});
			},
			//提交
			submitForm(){
				this.$refs.form.validate().then(res=>{
					if(!this.loading){
						this.loading = true
						this.formData.address = this.text
						this.$api.post("/core/add/", this.formData, {"Mid": "Recharge"}).then(res => {
							this.loading = false
							if(res.code == 20000){
								uni.showToast({
									title: "成功，等待审核",
									icon: 'success'
								});
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
			//选择图片后触发
			selectImg(e){
				uni.showLoading({
					title: '正在上传'
				})
				this.$api.uploadFile('/file/upload/', e.tempFilePaths[0]).then(res => {
					uni.hideLoading()
					if(res.code == 20000){
						uni.showToast({
							title: "上传成功",
							icon: 'success'
						})
						this.formData.pic = res.data.download_path
					}else{
						uni.showToast({
							title: "上传失败",
							icon: 'error'
						})
					}
				})
			},
			//删除图片
			deleteImg(e){
				this.formData.pic = ''
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
		
		.box{
			.item{
				color: #000;
				border: 1px solid #66666661;
				border-radius: 5px;
				text-align: center;
				padding: 7px 0;
				margin-bottom: 10px;
			}
			
			.active{
				border: 1px solid #007aff;
			}
		}
		.tips{
			color: #000;
			font-size: 12px;
			padding: 0 10px 10px 10px;
		}
		.qrcode-box{
			background-color: #fff;
			width: 132px;
			height: 132px;
			margin: 0 auto;
			border-radius: 10px;
		}
		.address{
			color: #000;
			font-size: 12px;
			background: rgba(0,0,0,0.1);
			border-radius: 10px;
			padding: 10px;
			text-align: center;
			margin-top: 15px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		
		.btns{
			padding: 30px 0;
		}
	}
</style>
