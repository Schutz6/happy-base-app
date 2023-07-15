<template>
	<view class="page overflow-hidden" :style="{'width': width+'px', 'height': height+'px'}" @touchmove.stop.prevent>
		<uni-nav-bar title="绑定提现卡" backgroundColor="#000" dark status-bar :border="false" height="44px" leftWidth="60px" rightWidth="60px">
			<block slot="left">
				<uni-icons @tap="back()" type="back" color="#fff" size="22" />
			</block>
			<block slot="right">
				<uni-icons @tap="add()" type="plus" color="#fff" size="22" />
			</block>
		</uni-nav-bar>
		<scroll-view @scrolltolower="lower" :scroll-y="true" :scroll-x="false" :style="{'height': height-44+'px'}">
			<view class="content">
				<view class="list" v-if="list.length>0">
					<view class="item d-flex-center" v-for="(item, index) in list" :key="index">
						<view class="box" v-if="item.type=='1'">
							<view class="d-flex between">
								<view class="title">{{item.bank_name}}</view>
								<uni-icons type="trash" size="24" color="white" @tap="showDelete(item.id)"></uni-icons>
							</view>
							<view class="sub-title">储蓄卡</view>
							<view class="card_number d-flex-center">{{item.card_number | formatCardnumber}}</view>
						</view>
						<view class="box" v-if="item.type=='2'">
							<view class="d-flex between">
								<view class="title">USDT-Trc20</view>
								<uni-icons type="trash" size="24" color="white" @tap="showDelete(item.id)"></uni-icons>
							</view>
							<view class="sub-title">区块链地址</view>
							<view class="card_number d-flex-center">{{item.address_usdt | formatCardnumber}}</view>
						</view>
					</view>
					<uni-load-more :status="moreStatus"></uni-load-more>
				</view>
				<view class="no-data" v-if="list.length==0">
					<view class="d-flex-center flex-column">
						<view class="fs14">暂无数据</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<uni-popup ref="deleteDialog" type="center">
			<view class="dialog-box">
				<view class="head">提示</view>
				<view class="content">是否删除该银行卡？</view>
				<view class="line"></view>
				<view class="d-flex-center footer">
					<view class="flex1 cancel" @tap="hideDialog('deleteDialog')">取消</view>
					<view class="line"></view>
					<view class="flex1 confirm" @tap="deleteItem()">确认</view>
				</view>
			</view>
		</uni-popup>
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
				moreStatus: "more",
				listQuery: {
					currentPage: 1,
					pageSize: 20,
					uid: null
				},
				list: [],
				selectId: null
			}
		},
		computed: {
			...mapGetters(['user'])
		},
		filters: {
		    //格式化银行卡
		    formatCardnumber(card_number){
				if(card_number.length>4){
					return ".... .... .... "+card_number.substr(-4)
				}
		    	return ".... .... .... "+card_number 
		    }
		},
		onLoad() {
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
		},
		onShow() {
			this.init()
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
			//新增
			add(){
				//点击了新增
				uni.navigateTo({
					url: "/pages/bank/add"
				})
			},
			init(){
				//初始化列表
				this.listQuery.currentPage = 1
				this.list = []
				this.getList()
			},
			//获取列表
			getList(){
				this.listQuery.uid = this.user.id
				this.$api.post("/core/list/", this.listQuery, {"Mid": "Bankcard"}).then(res => {
					if(res.code == 20000){
						this.moreStatus = res.data.results.length == 20 ? 'more' : 'noMore';
						if(res.data.results.length > 0){
							this.list = this.list.concat(res.data.results)
						}
					}
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
			//删除
			showDelete(id){
				this.selectId = id
				this.showDialog("deleteDialog")
			},
			//删除
			deleteItem(){
				if(!this.loading){
					this.loading = true
					this.$api.post("/core/delete/", {"id": this.selectId}, {"Mid": "Bankcard"}).then(res => {
						this.loading = false
						this.hideDialog("deleteDialog")
						if(res.code == 20000){
							uni.showToast({
								title: "删除成功",
								icon: 'success'
							});
							this.init()
						}else{
							uni.showToast({
								title: "删除失败",
								icon: 'error'
							});
						}
					})
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.content{
		
		.list{
			.item{
				padding: 10px 16px;
				
				.box{
					width: 100%;
					height: 130px;
					background-image: url(../../static/login/box-bg.png);
					background-size: 100% 100%;
					border-radius: 10px;
					padding: 16px;
					
					.title{
						font-weight: 600;
						color: #fff;
					}
					
					.sub-title{
						font-weight: 400;
						color: #fff;
						font-size: 12px;
					}
					.card_number{
						color: #fff;
						font-size: 32px;
						padding: 20px 0;
					}
				}
			}
		}
	}
</style>
