import Vue from 'vue';
import Vuex from 'vuex';
import Api from '@/api/index'

import { setUser, removeUser, setParams, removeToken } from '@/utils/auth'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 存放状态
        isLogin: false,//是否登录
        user: null,//用户信息
		params: null,//参数信息
		datas: {},//静态数据
    },
    getters: {
        // state的计算属性
        isLogin:state => state.isLogin,
        user:state => state.user,
		params:state => state.params,
		datas:state => state.datas
    },
    mutations: {
        // 更改state中状态的逻辑，同步操作
		//设置静态数据
		setDatas(state, datas){
			state.datas = datas
		},
		//设置用户信息
        setUser(state, user){
			if(user){
				state.isLogin = true
				state.user = user
				//保存用户信息
				setUser(user)
			}else{
				state.isLogin = false
				state.user = null
				//删除用户信息
				removeToken()
				removeUser()
			}
        },
		//设置参数信息
		setParams(state, params){
			if(params){
				state.params = params
				//保存参数信息
				setParams(params)
			}
		}
    },
    actions: {
        // 提交mutation，异步操作
		//获取参数信息
		getParams({ commit }){
			Api.get("/param/getList/").then(res => {
				if(res.code == 20000){
					commit('setParams', res.data)
				}
			})
		},
		//获取用户信息
		getUserInfo({ commit }){
			return new Promise((resolve, reject) => {
				Api.get("/user/").then(res => {
					console.log(res)
					if(res.code == 20000){
						commit('setUser', res.data)
					}else{
						commit('setUser', null)
					}
					//返回数据
					resolve(res)
				})
			})
		},
		//退出用户
		logout({ commit }){
			return new Promise((resolve, reject) => {
				Api.get("/logout/").then(res => {
					commit('setUser', null)
					//返回数据
					resolve(res)
				})
			})
		},
    },
});