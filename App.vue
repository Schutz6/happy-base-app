<script>
	import { getUser, getParams } from '@/utils/auth'
	import datas from '@/utils/datas'
	export default {
		async onLaunch() {
			console.log('App Launch')
			//获取参数设置
			let res = await this.$api.getAsync("/param/getList/")
			console.log(res)
			if(res.code == 20000){
				this.$store.commit('setParams', res.data)
			}
			//初始化静态数据
			this.$store.commit('setDatas', datas)
			//初始化用户信息
			this.$store.commit('setUser', getUser())
			//初始化网站设置信息
			this.$store.commit('setParams', getParams())
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
