<template>
	<view class="page overflow-hidden">
		<view class="content">
			<view class="list">
				<view class="item">
					<view class="icon-box">
						<view class="label">头像</view>
					</view>
					<view class="right">
						<view class="avatar">
							<image :src="user.avatar"></image>
						</view>
					</view>
				</view>
				<view class="line"></view>
				<view class="item">
					<view class="icon-box">
						<view class="label">UID</view>
					</view>
					<view class="right">
						<view class="label">{{user.id}}</view>
					</view>
				</view>
				<view class="line"></view>
				<view class="item">
					<view class="icon-box">
						<view class="label">账号</view>
					</view>
					<view class="right">
						<view class="label">{{user.username}}</view>
					</view>
				</view>
				<view class="line"></view>
				<view class="item" @click="goPage('/pages/me/nickname')">
					<view class="icon-box">
						<view class="label">昵称</view>
					</view>
					<view class="right">
						<view class="label">{{user.name}}</view>
						<uni-icons type="right" size="20" color="#ffffffb3"></uni-icons>
					</view>
				</view>
				<view class="line"></view>
				<view class="item" @click="goPage('/pages/me/updateMobile')">
					<view class="icon-box">
						<view class="label">绑定手机</view>
					</view>
					<view class="right">
						<view class="label">
							<text v-if="user.mobile">+{{user.area}} {{user.mobile}}</text>
							<text v-else>--</text>
						</view>
						<uni-icons type="right" size="20" color="#ffffffb3"></uni-icons>
					</view>
				</view>
				<view class="line"></view>
				<view class="item" @click="goPage('/pages/me/updateEmail')">
					<view class="icon-box">
						<view class="label">绑定邮箱</view>
					</view>
					<view class="right">
						<view class="label">{{user.email || "--"}}</view>
						<uni-icons type="right" size="20" color="#ffffffb3"></uni-icons>
					</view>
				</view>
				<view class="line"></view>
				<view class="item" @click="goPage('/pages/me/bindInvite')">
					<view class="icon-box">
						<view class="label">绑定邀请码</view>
					</view>
					<view class="right">
						<view class="label">{{user.pid || "绑定送福利"}}</view>
						<uni-icons type="right" size="20" color="#ffffffb3"></uni-icons>
					</view>
				</view>
				<view class="line"></view>
				<!-- #ifdef APP-PLUS -->
				<view class="item" @click="showDialog('popupCacheSize')">
					<view class="icon-box">
						<view class="label">清除缓存</view>
					</view>
					<view class="right">
						<view class="label">{{cacheSize}}</view>
						<uni-icons type="right" size="20" color="#ffffffb3"></uni-icons>
					</view>
				</view>
				<view class="line"></view>
				<view class="item" @click="showUpgrade()">
					<view class="icon-box">
						<view class="label">版本更新</view>
					</view>
					<view class="right">
						<view class="label"><view v-if="isUpgrade" class="dot"></view>V{{versionName}}</view>
						<uni-icons type="right" size="20" color="#ffffffb3"></uni-icons>
					</view>
				</view>
				<view class="line"></view>
				<!-- #endif -->
				<view class="btns">
					<view class="d-flex-center btn btn1" @click="showDialog('logoutDialog')">退出登录</view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="logoutDialog" type="center">
			<view class="dialog-box">
				<view class="head">提示</view>
				<view class="content">是否退出登录？</view>
				<view class="line"></view>
				<view class="d-flex-center footer">
					<view class="flex1 cancel" @tap="hideDialog('logoutDialog')">取消</view>
					<view class="line"></view>
					<view class="flex1 confirm" @tap="logout()">确认</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="popupCacheSize">
			<view class="dialog-box">
				<view class="head">清除缓存</view>
				<view class="content">
					已占用缓存{{cacheSize}}，确认清空吗？
				</view>
				<view class="line"></view>
				<view class="d-flex-center footer">
					<view class="flex1 cancel" @tap="hideDialog('popupCacheSize')">取消</view>
					<view class="line"></view>
					<view class="flex1 confirm" @tap="clearCache()">清除</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="popupUpgrade">
			<view class="dialog-box">
				<view class="head">发现新版本 - V{{params.versionCode}}</view>
				<view class="content">{{params.versionInfo}}</view>
				<view class="line"></view>
				<view class="d-flex-center footer">
					<view class="flex1 cancel" @tap="hideDialog('popupUpgrade')">取消</view>
					<view class="line"></view>
					<view class="flex1 confirm" @tap="upgrade()">升级</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="popupNoUpgrade">
			<view class="dialog-box">
				<view class="head">提示</view>
				<view class="content">当前已是最新版本</view>
				<view class="line"></view>
				<view class="d-flex-center footer">
					<view class="confirm" @click="hideDialog('popupNoUpgrade')">确定</view>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				platform: "",
				versionName: "1.0.0",
				cacheSize: "0B",
				isUpgrade: false
			}
		},
		computed: {
			...mapGetters(['user', 'params'])
		},
		onShow() {
			this.$store.dispatch('getUserInfo')
		},
		onReady() {
			let self = this;
			// #ifdef APP-PLUS
			//获取平台信息
			this.platform = uni.getSystemInfoSync().platform
			//获取版本号
			this.versionName = plus.runtime.version
			//获取缓存大小
			plus.cache.calculate(size => {
				if (size < 1024) {
					self.cacheSize = size + 'B';
				} else if (size / 1024 >= 1 && size / 1024 / 1024 < 1) {
					self.cacheSize = Math.floor((size / 1024) * 100) / 100 + 'KB';
				} else if (size / 1024 / 1024 >= 1) {
					self.cacheSize = Math.floor((size / 1024 / 1024) * 100) / 100 + 'M';
				}
			});
			//判断是否需要更新
			if(this.versionName != this.params.versionCode){
				this.isUpgrade = true
			}
			// #endif
		},
		methods: {
			//退出登录
			logout(){
				this.$api.get("/logout/").then(res => {
					uni.reLaunch({
						url: '/pages/common/login/login'
					})
				})
			},
			//显示弹出框
			showDialog(id){
				this.$refs[id].open()
			},
			//关闭弹出框
			hideDialog(id){
				this.$refs[id].close()
			},
			//跳转页面
			goPage(page){
				if(page == '/pages/me/bindInvite'){
					if(this.user.pid){
						return
					}
				}
				uni.navigateTo({
					url: page
				});
			},
			//清除缓存
			clearCache(){
				// #ifdef APP-PLUS
				let self = this;
				plus.cache.clear(res=>{
					self.hideDialog('popupCacheSize')
					uni.showToast({
						title: "清除成功",
						icon: 'none',
						success() {
							self.cacheSize = '0B';
						}
					});
				});
				// #endif
			},
			//显示升级框
			showUpgrade(){
				if(this.isUpgrade){
					this.showDialog("popupUpgrade")
				}else{
					this.showDialog("popupNoUpgrade")
				}
			},
			//升级
			upgrade(){
				// #ifdef APP-PLUS
				if(this.platform == "android"){
					plus.runtime.openURL(this.params.androidDownloadUrl)
				}else{
					plus.runtime.openURL(this.params.iosDownloadUrl)
				}
				// #endif
			}
		}
	}
</script>

<style scoped lang="scss">
	.btns{
		padding: 30px 20px;
	}
	.list{
		margin: 0 10px;
		
		.line{
			width: 90%;
			margin: 0 auto;
			height: 1px;
			background-color: #66666661;
		}
		.item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #ffffff;
			font-size: 14px;
			padding: 15px 20px;
			
			.icon-box{
				display: flex;
				align-items: center;
				
				.label{
					padding-left: 10px;
				}
			}
			
			.right{
				display: flex;
				align-items: center;
				
				.avatar{
					margin-right: 5px;
					
					image{
						width: 40px;
						height: 40px;
						border: 1px solid #fff;
						border-radius: 50%;
					}
				}
				
				.label{
					display: flex;
					align-items: center;
					font-size: 14px;
					color: rgba(255,255,255,0.4);
					padding-right: 10px;
					
					.dot{
						width: 10px;
						height: 10px;
						border-radius: 10px;
						background-color: red;
						margin-right: 5px;
					}
				}
			}
		}
	}
</style>