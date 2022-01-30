<template>
	<view class="wrapper">
		<u-popup :show="isShow" :round="10" mode="center" @close="close" @open="open" closeOnClickOverlay :customStyle="{'width': '550rpx','height': '850rpx'}">
			
			<view class="dating-card-wrap">

				<view class="user-info" v-if="Object.keys(userData).length">
					<view class="user-avatar">
						<image class="avatar" :src="userData.avatar || '../../static/avatar.png'" mode=""></image>
					</view>
					<view class="info">
						<view class="info-name">{{userData.nickName}}</view>
						<view class="info-person">
							<block v-if="userData.gender">
								<view class="item-info" v-if="userData.gender">性别：<text class="text">{{userData.gender | transformGenderMine}}</text></view>
								<view class="item-info" v-else>性别：未绑定</view>
								<view class="item-info" v-if="userData.age">年龄：<text class="text">{{userData.age}}岁</text></view>
								<view class="item-info" v-else>年龄：未绑定</view>							
							</block>
						</view>
						<view class="info-label">
							<block v-if="userData.labelList.length">
								<text class="item-label" v-for="(item,index) in userData.labelList" :key="index">{{item}}</text>							
							</block>
						</view>
					</view>
				</view>
				
<!-- 				<button v-else class="user-info" open-type="getUserInfo" @click="getUserProfile()">
					<view class="user-avatar">
						<image class="avatar"  src="../../static/avatar.png"></image>
					</view>
					<view class="info">
						<view class="info">
							<view class="info-name">游客</view>
						</view>
						<view class="info-name">
							<view class="btn-login">登录</view>
						</view>
					</view>
				</button> -->
				
				<view class="handler-wrap">
					<view class="btn-submit" @click="close">关闭</view>
				</view>
				
			</view>
			
		</u-popup>
	</view>
</template>

<script>
	// 按需导入 mapMutations 辅助函数
	import { mapState, mapMutations } from 'vuex'
	export default {
		name:"dating-card",
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['userinfo','token']),
		},
		data() {
			return {
				userData: {},
			};
		},
		props: {
			isShow: {
				type: Number,
				default: false
			},
			userId: {
				type: [Number,String],
				default: false
			}
		},
		watch:{
			isShow(){
				if(this.isShow) return this.getUserinfo(this.userId);
			}
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
			open() {
				// console.log('open');
			},
			close() {
				this.userData = {};
				
				this.$emit('close');
			},
			async getUserinfo(userId) {
				
				// 发起请求
				const res = await uni.$http.get(uni.$url.getUserFriendCardInfo, { userId });
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				this.userData = res.data.data;
				
				// this.isDatingCardShow = true;
				
			},
			// // 获取微信用户的基本信息
			// getUserProfile(e) {
				
			// 	// this.isLoginModalShow = true;
			
			// 	this.getCode();
			
			// 	uni.getUserProfile({
			// 		desc: '用于完善会员资料',
			// 		success: (res) => {
			
			// 			//将用户的基本信息存储到 vuex 中
			// 			this.updateUserInfo(res.userInfo);
			
			// 			// 获取登录成功后的 Token 字符串
			// 			this.getToken(res)
			 
			// 		}
			// 	});
			
			// },
			// async getCode() {
			// 	// 调用微信登录接口
			// 	const [err, res] = await uni.login().catch(err => err);
				
			// 	// 判断是否 uni.login() 调用失败
			// 	if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
			
			// 	uni.setStorageSync('code', res.code);
			// },
			// // 调用登录接口，换取永久的 token
			// async getToken(info) {
			// 	console.log(info)
			// 	// 准备参数对象
			// 	const query = {
			// 		code: uni.getStorageSync('code'),
			// 		avatar: info.userInfo.avatarUrl,
			// 		nickName: info.userInfo.nickName,
			// 		city: info.userInfo.city,
			// 		country: info.userInfo.country,
			// 		gender: info.userInfo.gender,
			// 		province: info.userInfo.province
			// 	}
			// 	// 换取 token
			// 	const loginResult = await uni.$http.post(uni.$url.wxLoginUrl, query)
				
			// 	if (loginResult.data.code !== 200) return uni.$showMsg('登录失败！')
				
			// 	uni.showToast({
			// 	 title: '登录成功',
			// 	 icon: 'success'
			// 	})
				
			// 	uni.setStorageSync('sessionKey', loginResult.data.data.sessionKey);
				
			// 	this.updateUserInfo(loginResult.data.data.user);
				
			// 	this.updateToken('Bearer ' + loginResult.data.data.token);
				
			// 	if(loginResult.data.data.user.userId && loginResult.data.data.user.gender == 0) return this.isPersonalShow = true;
				
			// 	this.getUserinfo(this.userId);
				
			// },
		}
	}
</script>

<style lang="scss">
	
	.dating-card-wrap {
		width: 550rpx;
		height: 850rpx;
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
			width: 150rpx;
			height: 150rpx;
			flex-shrink: 0;
			margin: 35rpx 0 30rpx 0;
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
				margin-bottom: 30rpx;
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
				font-size: 28rpx;
				font-weight: 400;
				color: #878787;
				text-align: left;
				margin-bottom: 35rpx;
				.item-info {
					display: inline-block;
					width: 50%;
					.text {
						color: #000000;
					}
				}
			}
			.info-label {
				display: flex;
				margin-top: 35rpx;
				justify-content: space-around;
				flex-wrap: wrap;
				.item-label {		
					position: relative;
					display: inline-block;
					height: 70rpx;
					line-height: 70rpx;
					padding: 0 10rpx;
					margin: 0 20rpx 25rpx 20rpx;
					color: #37277B;
					background: #E3E6F3;
					border: 1rpx solid #B3B8D9;
					border-radius: 10rpx;
				}
			}
		}
		.btn-submit {
			position: absolute;
			bottom: -155rpx;
			left: 50%;
			display: flex;
			width: 300rpx;
			height: 80rpx;
			margin-left: -150rpx;
			background: #FFFFFF;
			border: 1px solid #CCCCCC;
			border-radius: 40px;
			font-size: 30rpx;
			font-weight: 400;
			justify-content: center;
			align-items: center;
		}
	
	}

</style>
