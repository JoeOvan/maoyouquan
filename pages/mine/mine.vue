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
		

		<view class="bg-wrap">
			<image class="bg-center" src="../../static/bg_mine.png"></image>
			<image class="bg-mine-flag" src="../../static/bg_mine_flag.png"></image>
		</view>
		
		<view class="user-info-wrap">
			<block class="" v-if="!token">
				<button class="user-info" open-type="getUserInfo" @click="getUserProfile()">
					<view class="user-avatar">
						<image class="avatar"  :src="userinfo.avatar || '../../static/avatar.png'"></image>
					</view>
					<view class="info">
						<view class="info">
							<view class="info-name">{{userinfo.nickName || '游客'}}</view>
						</view>
						<view class="info-name">
							<view class="btn-login">登录</view>
						</view>
					</view>
				</button>
			</block>
			<view class="user-info" v-if="token">
				<view class="user-avatar">
					<image class="avatar" :src="userinfo.avatar || '../../static/avatar.png'" mode=""></image>
				</view>
				<view class="info">
					<view class="info-name">{{userinfo.nickName}}</view>
					<view class="info-phone" v-if="userinfo.mobile">{{userinfo.mobile}}</view>
					<view class="info-person">
						<block v-if="userinfo.gender">
							<view class="item-info" v-if="userinfo.gender">性别：<text class="text">{{userinfo.gender | transformGenderMine}}</text></view>
							<view class="item-info" v-else>性别：未绑定</view>
							<view class="item-info" v-if="userinfo.age">年龄：<text class="text">{{userinfo.age}}岁</text></view>
							<view class="item-info" v-else>年龄：未绑定</view>							
						</block>
						<view v-else class="btn-edit-info" @click="editPersonalInfo">请完善个人资料</view>
					</view>
					<view class="info-label">
						<block v-if="userinfo.labelList.length">
							<text class="item-label" v-for="(item,index) in userinfo.labelList" :key="index">{{item}}</text>
							<text class="item-edit" @click="editLabel">编辑</text>							
						</block>
						<view v-else class="btn-edit-label" @click="editLabel">编辑个性标签</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="info-list">
			<navigator class="info-list-item" url="/pages/mine/publish" v-if="token">
				<view class="text-wrap">
					<image class="icon icon-publish" src="../../static/icon-publish.png" mode=""></image src="..">
					我发布的
				</view>
				<image class="arrows" src="../../static/icon-arrows.png"></image>
			</navigator>
			<navigator class="info-list-item" url="/pages/mine/invite" v-if="token">
				<view class="text-wrap">
					<image class="icon icon-invite" src="../../static/icon-invite.png" mode=""></image>我应邀的
				</view>
				<image class="arrows" src="../../static/icon-arrows.png"></image>
			</navigator>
			<view class="info-list-item">
				<view class="text-wrap">
					<image class="icon icon-contact" src="../../static/icon-contact.png" mode=""></image>
					<button class="order-contact-service" open-type="contact">联系客服</button>
				</view>
				<image class="arrows" src="../../static/icon-arrows.png"></image>
			</view>
			<navigator class="info-list-item" url="/pages/mine/account" v-if="token">
				<view class="text-wrap">
					<image class="icon icon-about" src="../../static/icon-about.png" mode=""></image>
					我的账户
				</view>
				<image class="arrows" src="../../static/icon-arrows.png"></image>
			</navigator>
		</view>
		
		<view v-if="token" class="btn-logout" @click="logout">
			<view class="text">退出账号</view>
		</view>
		
		<view class="copyright">版权所有：茂名市黑洞文化传播有限公司</view>
		
		<personal-modal :isShow="isPersonalShow" @close="isPersonalShow = false" @updateData="getUserInfo"></personal-modal>

		<label-modal :isShow="isLabelShow" @close="isLabelShow = false" @updateData="getUserInfo"></label-modal>
		
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
				isPersonalShow: false,  //个人资料弹出窗
				isLabelShow: false,  //标签弹出窗
				labelList: [],
			}
		},
		onShow() {
			this.getUserInfo();
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
			leftClick() {
			
				uni.switchTab({
					url: '/pages/index/index'
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
				
				if(loginResult.data.data.user.userId && loginResult.data.data.user.gender == 0) return this.isPersonalShow = true;
			},
			// 退出登录
			async logout() {
				// 询问用户是否退出登录
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认退出登录吗？'
				}).catch(err => err)
			
				if (succ && succ.confirm) {
					// 用户确认了退出登录的操作
					
					// 退出登录
					const res = await uni.$http.post(uni.$url.wxLogoutUrl)
					
					if (res.data.code !== 200) return uni.$showMsg('退出失败，请重试！')
					
					uni.$showMsg(res.data.msg);
					
					// 需要清空 vuex 中的 userinfo、token 和 address
					this.updateUserInfo({})
					this.updateToken('')
					
					this.getUserInfo();
				}
			},
			async getUserInfo() {
				
				// 发起请求
				const res = await uni.$http.get(uni.$url.getUserInfo)
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				let data = res.data.data;
				
				this.updateUserInfo(data);
				
				// let token = this.$store.state.m_user.token;
				if(!data.userId) return this.updateToken('');
				
				if(data.userId && data.gender == 0) return this.isPersonalShow = true;
			},
			editLabel() {
				this.isLabelShow = true;
			},
			editPersonalInfo() {
				this.isPersonalShow = true;
			}
		},
		onPullDownRefresh() {
			console.log('refresh');
			
			this.getUserInfo();
			
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>

<style lang="scss">
	
	page {
		background: #f0f0f0;
	}
	
	.left-wrap {
		display: flex;
		.navbar-left-text {
			color: #FFFFFF;
		}
	}

	.bg-wrap {
		position: relative;
		.bg-center {
			width: 100%;
			height: 330rpx;
		}
		.bg-mine-flag {
			position: absolute;
			width: 292rpx;
			height: 42rpx;
			top: 22rpx;
			left: 50%;
			margin-left: -146rpx;
		}
	}
	
	
	//个人中心
	.user-info-wrap {
		position: relative;
		width: 430rpx;
		// height: 500rpx;
		margin: -255rpx auto 0 auto;
		padding-bottom: 65rpx;
		background: #FFFFFF;
		box-shadow: 0 20rpx 20rpx 0 rgba(0, 0, 0, 0.1);
		border-radius: 30rpx;
		overflow: hidden;
		.user-info {
			text-align: center;
			background: #FFFFFF;
			&::after {
				border: none;
			}
		}
		.user-avatar {
			display: inline-block;
			width: 120rpx;
			height: 120rpx;
			flex-shrink: 0;
			margin: 60rpx 0 30rpx 0;
			image{
				border-radius: 50%;
			}
			.avatar {
				display: inline-block;
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.info {
			padding: 0 60rpx;
			font-weight: bold;
			color: #FFFFFF;
			.info-name {
				font-size: 34rpx;
				margin-bottom: 9rpx;
				font-size: 34rpx;
				font-weight: 500;
				color: #37277B;
			}
			.info-phone {
				display: block;
				margin: 20rpx 0;
				color: #333333;
				font-size: 30rpx;
				font-weight: 400;
			}
			.info-person {
				font-size: 24rpx;
				font-weight: 400;
				color: #878787;
				text-align: left;
				.item-info {
					display: inline-block;
					width: 50%;
					.text {
						color: #000000;
					}
				}
				.btn-edit-info {
					width: 300rpx;
					height: 60rpx;
					line-height: 60rpx;
					color: #666666;
					font-size: 30rpx;
					font-weight: 400;
					background: #FFFFDC;
					border: 1rpx solid #E2E28F;
					border-radius: 10rpx;
					text-align: center;
					vertical-align: middle;
				}
			}
			.info-label {
				display: flex;
				margin-top: 35rpx;
				justify-content: space-around;
				flex-wrap: wrap;
				.item-label {
					display: inline-block;
					margin-bottom: 10rpx;
					padding: 5rpx 10rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #37277B;
					background: #E3E6F3;
					border: 1rpx solid #B3B8D9;
					border-radius: 6rpx;
				}
				.item-edit {
					display: inline-block;
					margin-bottom: 10rpx;
					padding: 5rpx 10rpx;
					background: #F3F3F3;
					border: 1rpx dashed #B3B8D9;
					border-radius: 6rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #666666;
				}
				.btn-edit-label {
					width: 300rpx;
					height: 60rpx;
					line-height: 60rpx;
					color: #666666;
					font-size: 30rpx;
					font-weight: 400;
					background: #F3F3F3;
					border: 1rpx dashed #B3B8D9;
					border-radius: 6rpx;
					text-align: center;
					vertical-align: middle;
				}
			}
		}
	}
	
	
	
	//用户信息列表
	.info-list {
		width: 670rpx;
		// height: 340rpx;
		margin: 50rpx 40rpx 40rpx 40rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		.info-list-item {
			position: relative;
			display: flex;
			height: 86rpx;
			line-height: 86rpx;
			padding: 0 30rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #000000;
			border-bottom: 1rpx solid #f1f1f1;
			justify-content: space-between;
			align-items: center;
			&:last-child {
				border-bottom: none;
			}
			.text-wrap {
				display: flex;
				width: 100%;
				align-items: center;
			}
			.arrows {
				display: inline-block;
				width: 13rpx;
				height: 25rpx;
			}
			.icon {
				display: inline-block;
				width: 30rpx;
				height: 30rpx;
				margin-right: 20rpx;
				vertical-align: middle;
				flex-shrink: 0;
			}
			.order-contact-service {
				width: 100%;
				height: 85rpx;
				line-height: 85rpx;
				padding: 0;
				font-size: 30rpx;
				font-weight: 400;
				color: #333333;
				background: #ffffff;
				border-radius: 10px;
				border: none;
				text-align: left;
				&::after{
					border: none;
				}
			}
		}
	}
	
	.btn-login {
		margin: 0 auto;
		line-height: 46rpx;
	}
	
	//退出按钮
	.btn-logout {
		font-size: 28rpx;
		font-weight: 400;
		color: #000000;
		width: 670rpx;
		height: 80rpx;
		line-height: 80rpx;
		margin: 40rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		text-align: center;
	}
	
	.copyright {
		margin-bottom: 30rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #888888;
		text-align: center;
	}
	
</style>
