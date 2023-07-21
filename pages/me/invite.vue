<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="邀请记录" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view @scrolltolower="lower" :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="content">
				<view class="invite-box">
					<image src="@/static/me/invite-box.png"></image>
					<view class="qrcode-box-content d-flex-center">
						<view class="qrcode-box">
							<module-qrcode :qrPath.sync="qrPath" :text="params.inviteUrl+'?invite_code='+user.id" :size="size" :quality="quality" :colorDark="colorDark" :colorLight="colorLight"></module-qrcode>
						</view>
					</view>
				</view>
				<view class="">
					<view class="btn btn0 flex1 d-flex-center" @tap="copy(user.id+'')">
						<view style="padding-right: 5px;">{{user.id}}</view>
						<image src="@/static/me/copy.png" style="width: 18px;height: 18px;"></image>
					</view>
				</view>
				<view class="btns d-flex">
					<view class="btn btn1 flex1 d-flex-center" @tap="copy(params.inviteUrl+'?invite_code='+user.id)">复制链接</view>
					<view class="btn btn2 flex1 d-flex-center" @tap="toPage('/pages/me/team')">我的团队</view>
				</view>
				<view class="header d-flex between">
					<view class="d-flex">
						<view class="title">邀请记录</view>
					</view>
				</view>
				<view class="box" style="margin-top: 20px;">
					<view class="d-flex between">
						<view>邀请人数</view>
						<view>{{total}}人</view>
					</view>
					<view class="line"></view>
					<view class="list">
						<view class="item d-flex" v-for="(item, index) in list" :key="index">
							<view class="time flex1 d-flex-center">
								<uni-dateformat :date="item.add_time | formatDate" format="yyyy-MM-dd"></uni-dateformat>
							</view>
							<view class="flex1 d-flex-center">{{item.uid}}</view>
							<view class="money flex1 d-flex-center">{{item.balance.toFixed(2)}}</view>
						</view>
					</view>
				</view>
				<uni-load-more :status="moreStatus"></uni-load-more>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { navigateBack, formatDateUtc } from '@/utils/util'
	export default {
		data() {
			return {
				width: 0,//屏幕宽度
				height: 0,//屏幕高度
				qrPath: '',
				size: 75,
				quality:'L',
				colorDark: '#000000',
				colorLight: '#ffffff',
				moreStatus: "more",
				listQuery: {
					currentPage: 1,
					pageSize: 10
				},
				list: [],
				total: 0,
			}
		},
		computed: {
		    ...mapGetters(['user', 'params'])
		},
		filters: {
		    //格式化日期
		    formatDate(time){
		    	return formatDateUtc(time)
		    }
		},
		onLoad() {
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
			
			//获取列表
			this.getList()
		},
		methods: {
			//返回
			back(){
				navigateBack()
			},
			//滚动到底部
			lower(e){
				this.listQuery.currentPage += 1;
				this.getList()
			},
			//跳转页面
			toPage(page){
				uni.redirectTo({
					url: page
				})
			},
			//复制
			copy(data){
				uni.setClipboardData({
					data: data,
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
			//获取列表
			getList(){
				this.$api.post("/agent/inviteList/", this.listQuery).then(res => {
					if(res.code == 20000){
						this.moreStatus = res.data.results.length == 10 ? 'more' : 'noMore';
						this.total = res.data.total
						if(res.data.results.length > 0){
							this.list = this.list.concat(res.data.results)
						}
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.content{
		padding: 16px;
		background-color: #fff;
		
		.invite-box{
			position: relative;
			
			image{
				width: 100%;
				height: 380px;
				border: 1px solid #00E0FF;
				border-radius: 10px;
			}
			
			.qrcode-box-content{
				position: absolute;
				bottom: 60px;
				width: 100%;
			}
			
			.qrcode-box{
				background-color: #fff;
				width: 90px;
				height: 90px;
				border-radius: 5px;
			}
		}
		
		.btn{
			border-radius: 10px;
			height: 44px;
			width: 100%;
			color: #fff;
		}
		
		.btn0{
			margin-top: 20px;
			color: #fff;
			background: linear-gradient(256deg, #007FFF 0%, #00E0FF 100%);
		}
		
		.btns{
			padding: 20px 0;
			
			.btn1{
				margin-right: 5px;
				background: rgba(0,0,0,0.2);
			}
			.btn2{
				margin-left: 5px;
				background: linear-gradient(256deg, #007FFF 0%, #00E0FF 100%);
			}
		}
		
		.header{
			.title{
				font-weight: 500;
				color: #000;
				font-size: 18px;
				padding-right: 10px;
			}
		}
		
		.box{
			background: #1B2241;
			box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.24);
			border-radius: 10px;
			border: 1px solid #294D6B;
			padding: 16px;
			color: rgba(255,255,255,0.7);
			
			.line{
				width: 100%;
				height: 1px;
				background: #24415B;
				margin: 10px 0;
			}
			
			.list{
				
				.item{
					font-size: 14px;
					color: rgba(255,255,255,0.7);
					padding: 10px 0;
					
					.time{
						justify-content: start;
					}
					.money{
						justify-content: end;
					}
				}
			}
		}
	}
</style>
