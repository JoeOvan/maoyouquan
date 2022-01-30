import App from './App'

// #ifndef VUE3
import Vue from 'vue'
// uView
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
//导入 store 的实例对象
import store from './store/store.js'
// import {mapMutations} from 'vuex'

import { API_URL } from './api/api.js'
uni.$url = API_URL

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'
uni.$http = $http

import './util/filter.js'

// 请求的根路径
// $http.baseUrl = 'https://www.uinav.com'

// 请求拦截器
$http.beforeRequest = function(options) {
	
	
	// // content-type 改为json格式
	// if (options.url.indexOf('/api/order/addOrder') !== -1) {
	// 	options.header = {
	// 		'Authorization': store.state.m_user.token || '',
	// 		'content-type' : 'application/json; charset=utf-8'
	// 	}
	// 	return
	// }
	
	// // content-type 改为json格式
	// if (options.url.indexOf('/api/subscribe/inviteAuthSuccess') !== -1) {
	// 	options.header = {
	// 		'Authorization': store.state.m_user.token || '',
	// 		'content-type' : 'application/json; charset=utf-8'
	// 	}
	// 	return
	// }
	
	// // content-type 改为json格式
	// if (options.url.indexOf('/api/feedback/beInviteFeedback') !== -1) {
	// 	options.header = {
	// 		'Authorization': store.state.m_user.token || '',
	// 		'content-type' : 'application/json; charset=utf-8'
	// 	}
	// 	return
	// }
	
	// // content-type 改为json格式
	// if (options.url.indexOf('/api/feedback/inviteFeedback') !== -1) {
	// 	options.header = {
	// 		'Authorization': store.state.m_user.token || '',
	// 		'content-type' : 'application/json; charset=utf-8'
	// 	}
	// 	return
	// }
	
	// // content-type 改为json格式
	// if (options.url.indexOf('/api/subscribe/beInviteAuthSuccess') !== -1) {
	// 	options.header = {
	// 		'Authorization': store.state.m_user.token || '',
	// 		'content-type' : 'application/json; charset=utf-8'
	// 	}
	// 	return
	// }
	
	
	// // 判断当前请求的是否为有权限的接口
	// if (options.url.indexOf('/') !== -1) {

	// 	options.header = {
	// 		'Authorization': store.state.m_user.token,
	// 		'content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
	// 	}
	// 	return
	// }
	
	
	// 判断当前请求的是否为有权限的接口
	if (options.url.indexOf('/') !== -1) {

		options.header = {
			'Authorization': store.state.m_user.token,
			'content-type' : 'application/json; charset=utf-8'
		}
		return
	}
	
}

// 响应拦截器
$http.afterRequest = function(res) {
  uni.hideLoading()


	// if(res.data.code == 401) {
		
	// 	uni.navigateTo({
	// 		url: '/pages/login/login'
	// 	})
		
	// 	return
		
	// }

  
  // const code = res.statusCode.toString();
  // if(code.startsWith('2')) {

  // 	let code = res.data.code;
  // 	if(code == 401) {
		// store.state.m_user.token = '';
		// store.state.m_user.userinfo = {};
		
		// // 询问用户是否登录
		// uni.showModal({
		// 	title: '提示',
		// 	content: '请先登录吗？',
		// 	success: function (res) {
		// 		if (res.confirm) {
		// 			console.log('用户点击确定');
		// 			// 用户确认了登录的操作
		// 			uni.switchTab({
		// 				url: `/pages/user/user`
		// 			})
		// 		} else if (res.cancel) {
		// 			console.log('用户点击取消');
		// 		}
		// 	}
		// });
  // 	}
  // }
}

// 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif