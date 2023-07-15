<script>
	import { getUser, getParams } from '@/utils/auth'
	import datas from '@/utils/datas'
	export default {
		onLaunch: async function(){
			console.log('App Launch')
			//初始化静态数据
			this.$store.commit('setDatas', datas)
			//初始化用户信息
			this.$store.commit('setUser', getUser())
			//初始化网站设置信息
			this.$store.commit('setParams', getParams())
			
			//获取系统参数
			let resParam = await this.$api.getAsync("/param/getList/")
			if(resParam && resParam.code == 20000){
				this.$store.commit('setParams', resParam.data)
			}
			//获取用户信息*(如果不需要验证用户请注释)
			let resUser = await this.$api.getAsync("/user/")
			if(resUser){
				if(resUser.code == 20000){
					//初始化用户信息
					this.$store.commit('setUser', resUser.data)
				}else if(resUser.code == 10010){
					//令牌过期
					uni.reLaunch({
						url: '/pages/common/login/login'
					})
				}
			}
		},
		onShow() {
			console.log('App Show')
		},
		onHide() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url('comm.css');

	page {
		background-color: #151A2F;
	}
	.uni-nav-bar-text{
		font-size: 16px !important;
	}
	
</style>
<style lang="scss">
	.no-data{
		padding: 20px;
		color: #777777;
	}
	
	.dialog-box{
		width: 260px;
		background: #fff;
		box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.14);
		border-radius: 10px;
		border: 1px solid #888;
		
		.head{
			color: #000;
			text-align: center;
			font-weight: 400;
			font-size: 16px;
			padding-top: 10px;
		}
		
		.content{
			color: #000;
			font-weight: 400;
			font-size: 14px;
			text-align: center;
			padding: 20px 16px 20px 16px;
		}
		
		.line{
			width: 260px;
			height: 1px;
			background: rgba(0,0,0,0.2);
		}
		
		.footer{
			text-align: center;
			height: 40px;
			
			.line{
				width: 1px;
				height: 26px;
				background: rgba(0,0,0,0.2);
			}
			.cancel{
				font-weight: 400;
				color: rgba(0,0,0,0.7);
				font-size: 14px;
			}
			.confirm{
				font-weight: 400;
				color: #007aff;
				font-size: 14px;
			}
		}
	}
</style>
