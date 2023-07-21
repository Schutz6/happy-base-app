<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="意见反馈" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="content">
				<view class="form">
					<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
						<uni-forms-item name="content">
							<template v-slot:label>
								<view class="label">意见内容</view>
							</template>
							<uni-easyinput trim="both" type="textarea" autoHeight v-model="formData.content" :styles="styles" placeholder="请输入意见内容"></uni-easyinput>
						</uni-forms-item>
						<uni-forms-item name="person">
							<template v-slot:label>
								<view class="label">联系人</view>
							</template>
							<uni-easyinput trim="both" v-model="formData.person" :styles="styles" placeholder="请输入联系人"></uni-easyinput>
						</uni-forms-item>
						<uni-forms-item name="contact">
							<template v-slot:label>
								<view class="label">联系方式</view>
							</template>
							<uni-easyinput trim="both" v-model="formData.contact" :styles="styles" placeholder="请输入联系方式"></uni-easyinput>
						</uni-forms-item>
						<view class="btns">
							<view class="d-flex-center btn btn1" @click="submit()">提交</view>
						</view>
					</uni-forms>
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
					content: null,
					person: null,
					contact: null
				},
				rules: {
					content: {
						rules: [{
							required: true,
							errorMessage: "请输入意见内容"
						}]
					},
				},
				styles: {
					color: '#000',
					backgroundColor: 'transparent'
				},
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
			this.formData.name = this.user.name
		},
		methods: {
			//返回
			back(){
				navigateBack()
			},
			submit(){
				this.$refs.form.validate().then(res=>{
					if(!this.loading){
						uni.showLoading({
							title: "正在提交"
						})
						this.loading = true
						this.$api.post("/core/add/", this.formData, {"Mid": "Feedback"}).then(res => {
							this.loading = false
							uni.hideLoading()
							if(res.code == 20000){
								uni.showToast({
									title: "提交成功",
									icon: 'success'
								})
								setTimeout(()=>{
									this.back()
								}, 500)
							}else{
								uni.showToast({
									title: "提交失败",
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
