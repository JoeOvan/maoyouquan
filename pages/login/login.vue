<template>
	<view class="wrapper">
		<u-navbar class="nav-wrap"
			placeholder
			safeAreaInsetTop
			fixed
			bgColor="#37277B"
			@leftClick="leftClick"
		>
			<view slot="left" class="left-wrap">
				<u-icon
					name="arrow-left"
					size="19"
					color="#ffffff"
				></u-icon>
				<text
					class="navbar-left-text"
				>茂友圈</text>
			</view>
		</u-navbar>
		
		<view class="content">
			
			<image class="bg-login" src="../../static/bg-login.png"></image>
			
		</view>
		
		<view class="handler-wrap">
			<button class="btn-login" open-type="getUserInfo" @click="getUserProfile()">授权登录</button>
		</view>
		
		
	</view>
</template>

<script>
	// 按需导入 mapMutations 辅助函数
	import { mapState, mapMutations } from 'vuex'
	export default {
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['userinfo','token']),
		},
		data() {
			return {
				// token: true
			}
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
			leftClick() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取微信用户的基本信息
			getUserProfile(e) {
				
				// this.isLoginModalShow = true;
			
				this.getCode();
			
				uni.getUserProfile({
					desc: '用于完善会员资料',
					success: (res) => {
			
						//将用户的基本信息存储到 vuex 中
						this.updateUserInfo(res.userInfo);
			
						// 获取登录成功后的 Token 字符串
						this.getToken(res)
			 
					}
				});
			
			},
			async getCode() {
				// 调用微信登录接口
				const [err, res] = await uni.login().catch(err => err);
				
				// 判断是否 uni.login() 调用失败
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
			
				uni.setStorageSync('code', res.code);
			},
			// 调用登录接口，换取永久的 token
			async getToken(info) {
				console.log(info)
				// 准备参数对象
				const query = {
					code: uni.getStorageSync('code'),
					avatar: info.userInfo.avatarUrl,
					nickName: info.userInfo.nickName,
					city: info.userInfo.city,
					country: info.userInfo.country,
					gender: info.userInfo.gender,
					province: info.userInfo.province
				}
				// 换取 token
				const loginResult = await uni.$http.post(uni.$url.wxLoginUrl, query)
				
				if (loginResult.data.code !== 200) return uni.$showMsg('登录失败！')
				
				uni.showToast({
				 title: '登录成功',
				 icon: 'success'
				})
				
				uni.setStorageSync('sessionKey', loginResult.data.data.sessionKey);
				
				this.updateUserInfo(loginResult.data.data.user);
				
				this.updateToken('Bearer ' + loginResult.data.data.token);
				
				uni.navigateBack({
					delta: 1
				})
				
			},
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background: #f0f0f0;
	}
	
	.wrapper {
		width: 100%;
		height: 100%;
	}
	
	.left-wrap {
		display: flex;
		.navbar-left-text {
			color: #FFFFFF;
		}
	}
	
	.content {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		.bg-login {
			display: inline-block;
			width: 376rpx;
			height: 327rpx;
			margin-top: 295rpx;
		}
	}
	
	.handler-wrap {
		display: flex;
		position: fixed;
		bottom: 120rpx;
		width: 100%;
		justify-content: center;
		font-size: 34rpx;
		.btn-login {
			display: inline-block;
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			color: #FFFFFF;
			background: #07C160;
			border-radius: 10rpx;
		}
	}
</style>
