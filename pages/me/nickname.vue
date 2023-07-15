<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="修改昵称" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="content">
				<view class="form">
					<uni-forms ref="form" :modelValue="formData" :rules="rules">
						<uni-forms-item name="name">
							<view class="item">
								<uni-easyinput trim="both" v-model="formData.name" :styles="styles" placeholder="请输入昵称"></uni-easyinput>
							</view>
						</uni-forms-item>
						<view class="btns">
							<view class="d-flex-center btn btn1" @click="submit()">修改</view>
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
					name: null
				},
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: "请输入昵称"
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
							title: "正在修改"
						})
						this.loading = true
						this.$api.post("/user/", this.formData).then(res => {
							this.loading = false
							uni.hideLoading()
							if(res.code == 20000){
								uni.showToast({
									title: "修改成功",
									icon: 'success'
								})
								this.user.name = this.formData.name
								this.$store.commit('setUser', this.user)
								setTimeout(()=>{
									this.back()
								}, 500)
							}else{
								uni.showToast({
									title: "修改失败",
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
