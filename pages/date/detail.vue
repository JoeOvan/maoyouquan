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
				>{{inviteData.title}}</text>
			</view>
		</u-navbar>
		
		<view class="content">
			
			
			<map id="map" style="width: 100%; height: 500rpx;" :latitude="inviteData.lat" :longitude="inviteData.lon" :markers="markers" :show-location="true"></map>
			
			
			<view class="inviting-info-wrap">
				<view class="title-wrap">
					<view class="avatar-wrap">
						<image class="avatar" :src="inviteData.avatar || '../../static/avatar.png'" mode="" @click="getUserinfo(inviteData.wxUserId)"></image>
					</view>
					<view class="left-title">
						<text class="invite-type">{{inviteData.columnName}}</text><text class="title">{{inviteData.title}}</text>
					</view>
					<text class="count">{{inviteData.inviteNum}}人</text>
				</view>
				<view class="info-wrap">
					<view class="item-wrap item-time">
						<view class="item-info">
							<image class="icon" src="../../static/icon-invite-time.png" mode=""></image>
							<text class="text">{{inviteData.inviteDate | formatData}}</text>
						</view>
						<view class="item-info">
							<image class="icon" src="../../static/icon-invited-time.png" mode=""></image>
							<text class="text">{{inviteData.inviteOverTime | formatData}}截止</text>
						</view>
					</view>
					<view class="item-wrap">
						<view class="item-info">
							<image class="icon" src="../../static/icon-invite-address.png" mode=""></image>
							<text class="text">{{inviteData.address}}</text>
						</view>
					</view>
					<view class="item-wrap">
						<view class="item-info">
							<image class="icon" src="../../static/icon-invite-gender.png" mode=""></image>
							<text class="text">{{inviteData.beInviteSex | transformGender}}  {{inviteData.beInviteAge | transformAge}}</text>
						</view>
					</view>
					<view class="item-wrap">
						<view class="item-info">
							<image class="icon" src="../../static/icon-invite-pay.png" mode=""></image>
							<text class="text">{{inviteData.consumerType | transformPay}}</text>
						</view>
					</view>
					<view class="item-wrap" v-if="inviteData.remark">
						<view class="item-info">
							<image class="icon" src="../../static/icon-invite-remark.png" mode=""></image>
							<text class="text">{{inviteData.remark}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="inviter-show-wrap">
				
				<view class="inviter-avatar">
					<block v-for="(item,index) in inviteData.orderUser" :key="index">
						<image class="avatar" :src="item.avatar || '../../static/avatar.png'" @click="getUserinfo(item.userId)"></image>
					</block>
					<block v-for="(item,index) in (inviteData.inviteNum*2 - inviteData.orderUser.length)" :key="index">
						<view class="avatar-placeholder"></view>
					</block>
				</view>
				
				<view class="total-wrap">已有<text class="total">{{inviteData.orderUser.length}}</text>人应约</view>
			</view>
			
			<view class="invite-flag-wrap">
				<image class="bg-invite-flag" src="../../static/bg_invite_flag.png"></image>
			</view>
			
			<view class="invite-handler-wrap">
				<button :disabled="!isDisable" class="btn-invite" v-if="!inviteData.isBeInvitedUser && !inviteData.isInvitedUser && !inviteData.isEnoughUser" @click="beInvited(0)">
					<view class="icon-wrap">
						<image src="../../static/icon-invite-white.png" mode="" class="icon icon-publish"></image>
					</view>
					<text class="text">我要应邀</text>
				</button>
			</view>
			
		</view>
		
		
		<dating-card :isShow="isDatingCardShow" :userId="userId" @close="isDatingCardShow = false"></dating-card>
		

		<pay-modal :isShow="isPayShow" :orderSn="inviteData.orderSn" @close="isPayShow = false" @updateData="beInvited(1)"></pay-modal>
		
		
		<personal-modal :isShow="isPersonalShow" @close="isPersonalShow = false"></personal-modal>
		
	</view>
</template>

<script>
	import { debounce } from 'lodash'
	export default {
		data() {
			return {
				 //应邀对象
				inviteData: {
					inviteNum: 1,
					inviteOverTime: '2022-01-01 10:30'
				},
				latitude: 21.66329,
				longitude: 110.92523,
				
				isShowLocation: true,
				mapCtx: null,
				// markers: [],
				markers: [{
					title: '',
					latitude: 21.66329,
					longitude: 110.92523,
					// iconPath: '../../static/logo.png',
					 //气泡callout
					callout: {
					  display:'ALWAYS',// 常显气泡
					  content: "item.userName",  //名称文本
					  color: '#fff',  //文本颜色
					  borderRadius: 5,  //边框圆角
					  borderWidth: 1,  //边框宽度
					  borderColor: '#0060ff',  //边框颜色
					  bgColor: '#0060ff',  //背景色
					  padding: 5,  //文本边缘留白
					  textAlign: 'center'  //文本对齐方式。有效值: left, right, center
					}
				}],
				
				
				isPersonalShow: false,
				isPayShow: false,
				orderSn: null,
				
				isDatingCardShow: false, //是否显示交友卡
				userId: null, //用户id
				
				isDisable: true,  //提交按钮是否禁用
			}
		},
		onLoad(options) {
			
			this.orderSn = options.id;
			
		},
		onShow() {
			this.getIndexOrderInfoById(this.orderSn);
		},
		created() {
			// 按钮防抖
		    this.beInvited = debounce(this.beInvited, 500)
		},
		//微信小程序分享到朋友圈功能
		onShareTimeline: function (res) {
			return {
			  title: this.inviteData.title || '茂友圈',
			  path: 'pages/date/detail?id=' + this.orderSn, // 显示的页面
			}
		// }
		},
		//微信小程序分享功能
		onShareAppMessage: function (res) {
			return {
			  title: this.inviteData.title || '茂友圈',
			  path: 'pages/date/detail?id=' + this.orderSn, // 显示的页面
			}
		},
		methods: {
			leftClick() {
				
				// uni.navigateBack({
				// 	delta: 1
				// })
				
				uni.switchTab({
					url: '/pages/index/index'
				})
				
			},
			async getIndexOrderInfoById(id) {
				
				let res = await uni.$http.get(uni.$url.getIndexOrderInfoById, { id });
				
				if(res.data.code == 401) {
					
					uni.navigateTo({
						url: '/pages/login/login'
					})
					
					return
					
				}
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				this.inviteData = res.data.data;
				
				// this.inviteData['inviterPlaceholderTotal'] = this.inviteData.inviteNum - this.inviteData.orderUser.length
				
				this.markers[0].callout.content = res.data.data.address;
				this.markers[0].latitude = res.data.data.lat;
				this.markers[0].longitude = res.data.data.lon;
				
			},
			async beInvited(type) {
				
				if(type == 0) {
					
					// 询问用户是否应邀
					const [err, succ] = await uni.showModal({
						title: '提示',
						content: '确认应邀吗？'
					}).catch(err => err)
					
					if (err || !succ || !succ.confirm) return uni.$showMsg("已取消当前操作");
					
				}
				
				//防止短时间内重复提交
				if(!this.isDisable) return;
				
				this.isDisable = false;
				
				let res = await uni.$http.post(uni.$url.beInvited, { orderSn: this.orderSn });
				
				
				//防止短时间内重复提交
				//1.5秒后取消button禁用
				setTimeout(() => {
					this.isDisable = true;
				},1500);
				
				if (res.data.code == 401) {
				
					uni.navigateTo({
						url: '/pages/login/login'
					})
				
					return
				
				}
				
				
				if (res.data.code == 1004) {
					
					//弹出完善个人资料界面
					this.isPersonalShow = true;
					
					uni.$showMsg(res.data.msg);
					
					return
				}
				
				if(res.data.code == 1002) {
					
					//弹出支付按钮
					this.isPayShow = true;
					
					uni.$showMsg(res.data.msg);
					
					return
					
				}
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.$showMsg(res.data.msg);
				
				let _this = this;
				// 获取用户的当前设置，判断是否点击了“总是保持以上，不在询问”
				uni.getSetting({
					withSubscriptions:true,  //是否获取用户订阅消息的订阅状态，默认false不返回
					success(res) {
						if(res.authSetting['scope.subscribeMessage']) { //用户点击了“总是保持以上，不再询问”
							uni.openSetting({ // 打开设置页
								success(res) {
									console.log(res.authSetting)
								}
							});
						} else { // 用户没有点击“总是保持以上，不再询问”则每次都会调起订阅消息
							
							let tmplIds1 = 'Sr5nyEickqWrcd1w2YDL2CMMLGo-5-mqshrgqcIOol4';	//活动提醒
							let tmplIds2 = 'HQ0vpAWW38l_6WAtm_V6qHhlFZchieYHgzr_sdgw6b8';	//工单过期通知
							let tmplIds3 = 'troZxKUs6JOpysxhNyeGJF_sUeKBRGtrQS0meAQlnUU';	//活动结果通知
							uni.requestSubscribeMessage({
								tmplIds: [tmplIds1,tmplIds2,tmplIds3],
								success: async res => {
									console.log('成功授权------',res);
									if(res[tmplIds1]=='accept') {
										//活动提醒
										uni.setStorageSync('acceptSubscribeMessageActivityTime', true);
									}
									if(res[tmplIds2]=='accept') {
										//工单过期通知
										uni.setStorageSync('acceptSubscribeMessageOrderExpiredRemind', true);
									}
									if(res[tmplIds3]=='accept') {
										//活动结果通知
										uni.setStorageSync('acceptSubscribeMessageBeInviteRemind', true);
									}
									
									let query = {
										"orderSn": _this.orderSn,
										"activityRemind": uni.getStorageSync('acceptSubscribeMessageActivityRemind') ? true : false,
										"beInviteRemind": uni.getStorageSync('acceptSubscribeMessageBeInviteRemind') ? true : false,
										"orderExpiredRemind": uni.getStorageSync('acceptSubscribeMessageOrderExpiredRemind') ? true : false
									}
									
									let res2 = await uni.$http.post(uni.$url.beInviteAuthSuccess, query);
									if (res2.data.code !== 200) return uni.$showMsg(res2.data.msg);
									uni.$showMsg(res2.data.msg);
								},
								fail: res => {
									uni.removeStorageSync('acceptSubscribeMessageActivityRemind');
									uni.removeStorageSync('acceptSubscribeMessageBeInviteRemind');
									uni.removeStorageSync('acceptSubscribeMessageOrderExpiredRemind');
									console.log(res);
								},
								complete: res => {
									console.log('我被点了');
									_this.getIndexOrderInfoById(_this.orderSn);
								}
							});
						}
					}
				})
				
				
				
				
				
				
			},
			toRepublish() {
				uni.navigateTo({
					url: '/pages/date/republish-date?orderSn=' + this.orderSn
				})
			},
			getUserinfo(userId) {
				
				this.userId = userId;
				
				this.isDatingCardShow = true;
				
			}
 		}
	}
</script>

<style lang="scss">
	.left-wrap {
		display: flex;
		.navbar-left-text {
			color: #FFFFFF;
		}
	}
	
	.content {
		padding-bottom: 130rpx;
	}
	
	.inviting-info-wrap {
		position: relative;
		z-index: 1000;
		margin: -150rpx 30rpx 30rpx 30rpx;
		padding: 30rpx;
		background: #FFFFFF;
		box-shadow: 0 10rpx 20rpx 0 rgba(0, 0, 0, 0.1);
		border-radius: 30rpx;
		.avatar-wrap {
			display: inline-block;
			width: 50rpx;
			margin-right: 10rpx;
			.avatar {
				display: inline-block;
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
			}
		}
		.title-wrap {
			display: flex;
			margin-bottom: 25rpx;
			justify-content: space-between;
			align-items: center;
			.left-title {				
				width: 475rpx;
				.invite-type {
					display: inline-block;
					padding: 3rpx 5rpx;
					margin-right: 10rpx;
					font-size: 34rpx;
					color: #666666;
					background: #DDDDDD;
					border-radius: 10rpx;
					vertical-align: top;
				}
				.title {
					display: inline-block;
					font-size: 34rpx;
					font-weight: bold;
					color: #010101;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					// display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
			.count {
				display: inline-block;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 20rpx;
				flex-shrink: 0;
				font-size: 30rpx;
				color: #FFFFFF;
				background: #FF3B5B;
				border-radius: 15rpx;
			}
		}
		.info-wrap {
			padding: 0 30rpx;
			background: #F4F4F4;
			border-radius: 10rpx;
			.item-wrap {
				padding: 15rpx 0;
				&.item-time {
					.item-info {
						display: inline-block;
						width: 50%;
					}
				}
				.item-info {

					.icon {
						display: inline-block;
						width: 36rpx;
						height: 36rpx;
						margin-right: 20rpx;
						vertical-align: middle;
					}
					.text {
						font-size: 30rpx;
						font-weight: 400;
						color: #000000;
					}
				}
			}
		}
	}
	
	
	
	.invite-handler-wrap {
		display: flex;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 130rpx;
		line-height: 130rpx;
		padding-top: 15rpx;
		justify-content: center;
		font-size: 30rpx;
		// background: #F0F0F0;
		.btn-invite {
			display: flex;
			width: 230rpx;
			height: 100rpx;
			padding: 0;
			margin: 0 auto;
			border-radius: 50rpx;
			justify-content: center;
			align-items: center;
			// transition: 0.5s;
			z-index: 1000;
			background: #FF3B5B;
			box-shadow: 0 15rpx 15rpx 0 rgba(193, 0, 32, 0.5), 0 8rpx 0 0 #C20020;
			border-radius: 50rpx;
			&[disabled] {
				color: #AAAAAA;
				background: #EFEFEF;
				box-shadow: 0 15rpx 15rpx 0 rgba(51, 51, 51, 0.5), 0 8rpx 0 0 #333333;
			}
			.icon-wrap {
				display: flex;
				width: 64rpx;
				height: 64rpx;
				justify-content: center;
				align-items: center;
				.icon-publish {
					display: inline-block;
					width: 40rpx;
					height: 35rpx;
				}
			}
			.text {
				color: #FFFFFF;
				font-size: 30rpx;
				font-weight: bold;
			}
		}
	}
	
	
	.inviter-show-wrap {
		width: 690rpx;
		margin: 40rpx auto 0 auto;
		text-align: center;
		.inviter-avatar {
			margin-bottom: 20rpx;
			text-align: center;
			.avatar {
				display: inline-block;
				width: 80rpx;
				height: 80rpx;
				margin: 0 15rpx;
				border-radius: 50%;
			}
			.avatar-placeholder {
				display: inline-block;
				width: 80rpx;
				height: 80rpx;
				margin: 0 15rpx;
				background: #FFFFFF;
				border: 1rpx dashed #AAAAAA;
				border-radius: 50%;
			}
		}
		.total-wrap {
			font-size: 24rpx;
			font-weight: 400;
			color: #888888;
			.total {
				color: #000000;
			}
		}
	}
	
	.invite-flag-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		.bg-invite-flag {
			display: block;
			width: 345rpx;
			height: 80rpx;
			margin: 50rpx auto;
		}
	}
	
</style>
