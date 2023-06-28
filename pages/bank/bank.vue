<template>
	<view class="page overflow-hidden">
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
					<view class="fs14">尚无任何银行卡</view>
				</view>
			</view>
		</view>
		
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
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
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
		onShow() {
			this.init()
		},
		onNavigationBarButtonTap(e){
			//点击了新增
			uni.navigateTo({
				url: "/pages/bank/add"
			})
		},
		onReachBottom() {
			this.listQuery.currentPage += 1;
			this.getList(false)
		},
		onPullDownRefresh(){
			//监听下拉刷新
			this.listQuery.currentPage = 1
			this.list = []
			this.getList(true)
		},
		methods: {
			init(){
				//初始化列表
				this.listQuery.currentPage = 1
				this.list = []
				this.getList(false)
			},
			//获取列表
			getList(isRefresh){
				this.listQuery.uid = this.user.id
				this.$api.post("/core/list/", this.listQuery, {"Mid": "Bankcard"}).then(res => {
					if(res.code == 20000){
						this.moreStatus = res.data.results.length == 10 ? 'more' : 'noMore';
						if(res.data.results.length > 0){
							this.list = this.list.concat(res.data.results)
						}
						if(isRefresh){
							uni.stopPullDownRefresh();
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
					this.$api.post("/bankcard/delete/", {"id": this.selectId}).then(res => {
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
		.no-data{
			padding: 20px;
			color: #777777;
		}
		
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
