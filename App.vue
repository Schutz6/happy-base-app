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
	
</style>
