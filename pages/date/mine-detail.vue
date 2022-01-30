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
		
		<view class="content" v-if="inviteData">
			
			
			<map id="map" style="width: 100%; height: 500rpx;" :latitude="inviteData.lat" :longitude="inviteData.lon" :markers="markers" :show-location="true"></map>
			
			
			<view class="inviting-info-wrap">
				<view class="title-wrap">
					<view class="avatar-wrap">
						<image class="avatar" :src="inviteData.avatar" mode="" @click="getUserinfo(inviteData.wxUserId)"></image>
					</view>
					<view class="left-title">
						<text class="invite-type">{{inviteData.columnName}}</text><text class="title">{{inviteData.title}}</text>
					</view>
					<!-- 判断是否为发布者 -->
					<block v-if="inviteData.isReleaseUser">
						<text class="count" v-if="inviteData.orderState !== 6 && inviteData.orderState !== 2">{{inviteData.inviteNum}}人</text>
						<text class="progress" v-else-if="inviteData.orderState == 2">进行中</text>
						<text class="progress" v-else-if="inviteData.orderState == 6">完成</text>
					</block>
					<block v-else>
						<!-- 判断是否被选中 -->
						<block v-if="!inviteData.orderUserIsNotCheck">
							<text class="count" v-if="inviteData.orderState !== 1 && inviteData.orderState !== 3 && inviteData.orderState !== 6">{{inviteData.inviteNum}}人</text>
							<text class="progress" v-else-if="inviteData.orderState == 2">进行中</text>
							<text class="progress" v-else-if="inviteData.orderState == 6">完成</text>		
						</block>
						<block v-else>
							<text class="not-check">未被选中</text>
						</block>
					</block>
				</view>
				
				<!-- 应邀者并且是被选中才能看到发布者的联系方式 -->
				<view class="mobile-tips-wrap" v-if="!inviteData.isReleaseUser && !inviteData.orderUserIsNotCheck">
					<view class="tips-wrap" v-if="!inviteData.isSeeMobileTime">
						<view class="left-wrap">
							<view class="tips">联系方式会在规定时间内显示</view>
						</view>
						<view class="right-wrap">
							<button class="item-handler item-handler-feedback" :disabled="inviteData.beInviteReleaseFeedback" @click="toFeedback(0,inviteData.orderUserId)">
								<image class="icon icon-handler-feedback" src="../../static/icon-handler-feedback.png"></image>
								<text class="text">{{ inviteData.beInviteReleaseFeedback ? '已反馈' : '反馈' }}</text>
							</button>
						</view>
					</view>
					<view class="mobile-wrap" v-else>
						<view class="left-wrap">
							<text class="label">联系方式：</text>
							<text class="mobile">{{inviteData.mobile}}</text>
						</view>
						<view class="right-wrap">
							<view class="item-handler item-handler-phone" @click="makePhoneCall(inviteData.mobile)">
								<image class="icon icon-handler-phone" src="../../static/icon-handler-phone.png"></image>
								<text class="text">拨打</text>
							</view>
							<button class="item-handler item-handler-feedback" :disabled="inviteData.beInviteReleaseFeedback" @click="toFeedback(0,inviteData.orderUserId)">
								<image class="icon icon-handler-feedback" src="../../static/icon-handler-feedback.png"></image>
								<text class="text">{{ inviteData.beInviteReleaseFeedback ? '已反馈' : '反馈' }}</text>
							</button>
						</view>
					</view>
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
							<text class="text">{{inviteData.beInviteSex | transformGender}}  ({{inviteData.beInviteAge | transformAge}})</text>
						</view>
					</view>
					<view class="item-wrap">
						<view class="item-info">
							<image class="icon" src="../../static/icon-invite-pay.png" mode=""></image>
							<text class="text">{{inviteData.consumerType | transformPay}}   {{inviteData.consumerType == 0 ?  '(人均消费：' + inviteData.aaAverageAmount + '元)' : ''}}</text>
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
			
			<!-- 发布者可见应邀列表 -->
			<view class="inviter-list-wrap" v-if="inviteData.isReleaseUser && inviteData.orderUser">
				
				<view class="item-inviter-wrap" v-for="(item,index) in inviteData.orderUser" :key="index">
					<view class="item-userinfo-wrap">
						<view class="avatar-wrap">
							<image class="avatar" :src="item.avatar || '../../static/avatar.png'" @click="getUserinfo(item.userId)"></image>
							<text class="username">{{item.nickName}}</text>
						</view>
						<view class="select-wrap">							
							<view class="phone" v-if="inviteData.isSeeMobileTime">{{item.mobile}}</view>
							<block v-if="inviteData.orderState !== 6">
								<!-- 应邀人数大于邀请最低人数 -->
								<view class="btn-select" v-if="(inviteData.orderUser.length > inviteData.inviteNum) && item.isCheck == 0 && inviteData.orderState !== 2" @click="chooseOrderUser(item.id,item.nickName)">选择</view>
								<view class="icon-wrap" v-else-if="item.isCheck == 1 && !inviteData.isSeeMobileTime">
									<image class="icon-select" src="../../static/icon-select.png"></image>
								</view>
							</block>
							<button class="btn-feedback" @click="toFeedback(1,item.id)" v-else-if="inviteData.orderState == 6 && !inviteData.isSeeMobileTime" :disabled="item.isInviteFeedback">
								<text class="text">{{ item.isInviteFeedback ? '已反馈' : '反馈' }}</text>
							</button>
						</view>
					</view>
					<view class="item-handler-wrap" v-if="inviteData.isSeeMobileTime">
						<view class="item-handler item-handler-phone" @click="makePhoneCall(item.mobile)">
							<image class="icon icon-handler-phone" src="../../static/icon-handler-phone.png"></image>
							<text class="text">拨打电话</text>
						</view>
						<view class="item-handler item-handler-copy" @click="copyPhoneNumber(item.mobile)">
							<image class="icon icon-handler-copy" src="../../static/icon-handler-copy.png"></image>
							<text class="text">复制号码</text>
						</view>
						<block v-if="item.arriveState == 0 && inviteData.isChangeDateTime">
							
							<button class="item-handler item-handler-arrive" :disabled="item.arriveState !== 0" @click="updateOrderUserState" :data-state="1" :data-id="inviteData.id" :data-orderuserid="item.id" :data-nickname="item.nickName">
								<image class="icon icon-handler-arrive" src="../../static/icon-handler-arrive.png"></image>
								<text class="text">已到达</text>
							</button>
							<button class="item-handler item-handler-breach" :disabled="item.arriveState !== 0" @click="updateOrderUserState" :data-state="2" :data-id="inviteData.id" :data-orderuserid="item.id" :data-nickname="item.nickName">
								<image class="icon icon-handler-breach" src="../../static/icon-handler-breach.png"></image>
								<text class="text">已违约</text>
							</button>
							
						</block>
						<block v-else>
							
							<button v-if="item.arriveState == 1" class="item-handler item-handler-arrive" :disabled="true">
								<image class="icon icon-handler-arrive" src="../../static/icon-handler-arrive.png"></image>
								<text class="text">已到达</text>
							</button>
							
							<button v-if="item.arriveState == 2" class="item-handler item-handler-breach" :disabled="true">
								<image class="icon icon-handler-breach" src="../../static/icon-handler-breach.png"></image>
								<text class="text">已违约</text>
							</button>
							
							<button v-if="!item.isInviteFeedback && inviteData.orderState == 6" class="item-handler item-handler-feedback" :disabled="item.isInviteFeedback" @click="toFeedback(1,item.id)">
								<image class="icon icon-handler-feedback" src="../../static/icon-handler-feedback.png"></image>
								<text class="text">反馈</text>
							</button>
							<button v-else-if="inviteData.orderState == 6" class="item-handler item-handler-feedback" :disabled="item.isInviteFeedback">
								<image class="icon icon-handler-feedback" src="../../static/icon-handler-feedback.png"></image>
								<text class="text">已反馈</text>
							</button>
							
						</block>
					</view>
				</view>
				
			</view>
			
			
			<view class="inviter-show-wrap" v-else>
				
				<view class="inviter-avatar">
					<block v-for="(item,index) in inviteData.orderUser" :key="index">
						<image class="avatar" :src="item.avatar || '../../static/avatar.png'" @click="getUserinfo(item.userId)"></image>
					</block>
					<block v-if="inviteData.orderState == 1 && inviteData.orderUser.length > 0">						
						<block v-for="(item,index) in (inviteData.inviteNum*2 - inviteData.orderUser.length)" :key="index">
							<view class="avatar-placeholder"></view>
						</block>
					</block>
					<block v-else-if="inviteData.orderState == 1">
						<block v-for="(item,index) in inviteData.inviteNum*2" :key="index">
							<view class="avatar-placeholder"></view>
						</block>
					</block>
				</view>
				
				<view class="total-wrap" v-if="inviteData.orderState == 1 || inviteData.orderState == 2">已有<text class="total">{{inviteData.orderUser.length || 0}}</text>人应约</view>
			</view>
			
			
			<view class="invite-handler-wrap">
				<view class="btn-invite-cancel" v-if="inviteData.isReleaseUser && inviteData.orderUser.length <= 0" @click="cancelInvite">
					<text class="text">取消邀约</text>
				</view>
				<view class="btn-invite-republish" v-if="inviteData.isReleaseUser && (inviteData.orderState !== 1 && inviteData.orderState !== 2)" @click="toRepublish">
					<text class="text">重新发布邀约</text>
				</view>
			</view>
			
			
		</view>
		
		<dating-card :isShow="isDatingCardShow" :userId="userId" @close="isDatingCardShow = false"></dating-card>

		<pay-modal :isShow="isPayShow" :orderSn="inviteData.orderSn" @close="isPayShow = false"></pay-modal>
		
		
		<personal-modal :isShow="isPersonalShow" @close="isPersonalShow = false"></personal-modal>
		
		
	</view>
</template>

<script>
	import { debounce } from 'lodash'
	// 按需导入 mapMutations 辅助函数
	import { mapState, mapMutations } from 'vuex'
	export default {
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['userinfo','token']),
		},
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
				
				orderUserState: 0, //到达状态 0未到达 1已到达 2违约未到达
				
				isDatingCardShow: false, //是否显示交友卡
				userId: null, //用户id
				
			}
		},
		onLoad(options) {
			
			this.orderSn = options.id;
			
		},
		onShow() {
			this.getMyOrderInfoById(this.orderSn);
		},
		created() {
			// 按钮防抖
		    this.beInvited = debounce(this.beInvited, 500)
		    this.cancelInvite = debounce(this.cancelInvite, 500)
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
			...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
			leftClick() {
				
				uni.navigateBack({
					delta: 1
				})
				
			},
			async getMyOrderInfoById(id) {
				
				let res = await uni.$http.get(uni.$url.getMyOrderInfoById, { id });
				
				if(res.data.code == 401) {
					
					uni.navigateTo({
						url: '/pages/login/login'
					})
					
					return
					
				}
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				this.inviteData = res.data.data;
				
				this.markers[0].callout.content = res.data.data.address;
				this.markers[0].latitude = res.data.data.lat;
				this.markers[0].longitude = res.data.data.lon;
				
			},
			async beInvited() {
				
				// 询问用户是否应邀
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认应邀吗？'
				}).catch(err => err)
				
				if (err || !succ || !succ.confirm) return uni.$showMsg("已取消当前操作");
				
				let res = await uni.$http.post(uni.$url.beInvited, { orderSn: this.orderSn });
				
				if (res.data.code == 1004) {
					
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
				
				this.getMyOrderInfoById(this.orderSn);
				
				
			},
			async cancelInvite() {
				
				
				// 询问用户是否取消
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认取消吗？'
				}).catch(err => err)
				
				if (err || !succ || !succ.confirm) return uni.$showMsg("已取消当前操作");
				
				let res = await uni.$http.post(uni.$url.cancelInvite+'/'+this.orderSn);
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				uni.$showMsg(res.data.msg);
				
				this.getMyOrderInfoById(this.orderSn);
			},
			toRepublish() {
				uni.navigateTo({
					url: '/pages/date/republish-date?orderSn=' + this.orderSn
				})
			},
			makePhoneCall(mobile) {
				uni.makePhoneCall({
				    phoneNumber: mobile //仅为示例
				});
			},
			copyPhoneNumber(mobile) {
				uni.setClipboardData({
					data: mobile,
					success: function() {
						//重点~做笔记
						//在success中加入uni.hideToast()可以解决
						// uni.hideToast();
						//以下就可自定义操作了~
						uni.showToast({
							title: '号码已复制',
							duration: 2000,
							icon: 'none'
						});
					},
					fail: function(err) {
						uni.showToast({
							title: '复制失败',
							duration: 2000,
							icon: 'none'
						});
					}
				});
			},
			async updateOrderUserState(e) {
				
				let nickName = e.currentTarget.dataset.nickname;
				
				// 询问用户是否更改用户状态
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认更改用户-'+ nickName +'-状态？'
				}).catch(err => err)
				
				if (err || !succ || !succ.confirm) return uni.$showMsg("已取消当前操作");

				let arriveState = e.currentTarget.dataset.state;
				let id = e.currentTarget.dataset.id;
				let orderUserId = e.currentTarget.dataset.orderuserid;
				
				let query = {
					arriveState: arriveState,
					id: id,
					orderUserId: orderUserId
				}
				
				let res = await uni.$http.post(uni.$url.updateOrderUserState, query);
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.$showMsg(res.data.msg);
				
				this.getMyOrderInfoById(this.orderSn);
				
			},
			getUserinfo(userId) {
				
				this.userId = userId;
				
				this.isDatingCardShow = true;
				
			},
			//选择工单用户
			async chooseOrderUser(orderUserId,nickName) {
				
				// 询问用户是否更改用户状态
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认选择用户-'+ nickName +'-为应邀用户，且不能修改？'
				}).catch(err => err)
				
				if (err || !succ || !succ.confirm) return uni.$showMsg("已取消当前操作");
				
				let res = await uni.$http.post(uni.$url.chooseOrderUser, { id: orderUserId });
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.$showMsg(res.data.msg);
				
				setTimeout(()=> {
					this.getMyOrderInfoById(this.orderSn);
				},1500);
				
			},
			toFeedback(type,orderUserId) {
				
				uni.navigateTo({
					url: '/pages/date/feedback?feedbackType=' + type + '&orderUserId=' + orderUserId 
				})
				
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
			margin-bottom: 45rpx;
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
			.not-check {
				display: inline-block;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 20rpx;
				flex-shrink: 0;
				font-size: 28rpx;
				font-weight: 400;
				color: #FFFFFF;
				border-radius: 15rpx;
				background: #999999;
			}
			.progress {
				display: inline-block;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 20rpx;
				flex-shrink: 0;
				font-size: 28rpx;
				font-weight: 400;
				color: #FFFFFF;
				border-radius: 15rpx;
				background: #07C160;
			}
		}
		.mobile-tips-wrap {
			background: #FFFDEE;
			border-radius: 10rpx;
			margin-bottom: 20rpx;
			.tips-wrap {
				height: 70rpx;
				line-height: 70rpx;
				padding: 0 20rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #FF748C;
				text-align: center;
				justify-content: space-between;
				.left-wrap {
					display: inline-block;
					flex-shrink: 0;
				}
				.right-wrap {
					display: inline-block;
					justify-content: center;
					align-items: center;
					.item-handler {
						display: inline-block;
						// height: 50rpx;
						line-height: 48rpx;
						background: #FFFFFF;
						border: 1rpx solid #CCCCCC;
						border-radius: 10rpx;
						text-align: center;
						box-sizing: border-box;
						padding: 0;
						&::after {
							border: none;
						}
						&[disabled] {
							color: #AAAAAA;
							background: #EFEFEF;
						}
						&.item-handler-phone,&.item-handler-feedback {
							display: flex;
							width: 120rpx;
							height: 50rpx;
							line-height: 50rpx;
							justify-content: center;
							align-items: center;
						}
						&.item-handler-feedback {
							margin-left: 10rpx;
						}
						.icon {
							display: inline-block;
							margin-right: 10rpx;
						}
						.icon-handler-phone {
							width: 17rpx;
							height: 17rpx;
						}
						.icon-handler-feedback {
							width: 18rpx;
							height: 17rpx;
						}
						.text {
							height: 50rpx;
							line-height: 50rpx;
							font-size: 24rpx;
							font-weight: 400;
							color: #000000;
						}
					}
				}
			}
			.mobile-wrap {
				display: flex;
				line-height: 70rpx;
				justify-content: space-between;
				padding: 0 20rpx;
				.left-wrap {
					display: inline-block;
					flex-shrink: 0;
					.label {
						font-size: 28rpx;
						font-weight: 400;
						color: #666666;
					}
					.mobile {
						font-size: 28rpx;
						font-weight: bold;
						color: #FF748C;
					}
				}
				.right-wrap {
					display: flex;
					justify-content: center;
					align-items: center;
					.item-handler {
						display: inline-block;
						// height: 50rpx;
						line-height: 48rpx;
						background: #FFFFFF;
						border: 1rpx solid #CCCCCC;
						border-radius: 10rpx;
						text-align: center;
						box-sizing: border-box;
						padding: 0;
						&::after {
							border: none;
						}
						&[disabled] {
							color: #AAAAAA;
							background: #EFEFEF;
						}
						&.item-handler-phone,&.item-handler-feedback {
							display: flex;
							width: 100rpx;
							height: 50rpx;
							line-height: 50rpx;
							justify-content: center;
							align-items: center;
						}
						&.item-handler-feedback {
							margin-left: 10rpx;
						}
						.icon {
							display: inline-block;
							margin-right: 10rpx;
						}
						.icon-handler-phone {
							width: 17rpx;
							height: 17rpx;
						}
						.icon-handler-feedback {
							width: 18rpx;
							height: 17rpx;
						}
						.text {
							height: 50rpx;
							line-height: 50rpx;
							font-size: 24rpx;
							font-weight: 400;
							color: #000000;
						}
					}
				}
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
		// height: 100rpx;
		// line-height: 100rpx;
		padding-top: 15rpx;
		font-size: 30rpx;
		justify-content: center;
		align-items: center;
		background: #F0F0F0;
		.btn-invite {
			display: flex;
			width: 230rpx;
			height: 100rpx;
			margin: 0 auto;
			border-radius: 10rpx;
			justify-content: center;
			align-items: center;
			// transition: 0.5s;
			z-index: 1000;
			background: #FF3B5B;
			box-shadow: 0 15rpx 15rpx 0 rgba(193, 0, 32, 0.5), 0 8rpx 0 0 #C20020;
			border-radius: 50rpx;
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
				font-weight: bold;
			}
		}
		.btn-invite-cancel {
			display: inline-block;
			width: 230rpx;
			height: 80rpx;
			line-height: 80rpx;
			color: #000000;
			margin: 0 30rpx;
			background: #DADADA;
			border-radius: 40rpx;
			text-align: center;
		}
		.btn-invite-republish {
			display: inline-block;
			width: 230rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #000000;
			margin: 0 30rpx;
			background: #FFFFFF;
			border: 1rpx solid #CCCCCC;
			border-radius: 40rpx;
			text-align: center;
		}
	}
	
	.inviter-list-wrap {
		width: 650rpx;
		padding: 10rpx 20rpx;
		margin: 0 auto;
		background: #FFFDEE;
		box-shadow: 0 10rpx 20rpx 0 rgba(0, 0, 0, 0.1);
		border-radius: 30rpx;
		.item-inviter-wrap {
			// display: flex;
			padding: 10rpx 0;
			border-bottom: 1rpx solid #DDDDDD;
			&:last-child {
				border: none;
			}
			.item-userinfo-wrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.avatar-wrap {
					display: flex;
					width: 290rpx;
					flex-shrink: 0;
					align-items: center;
					.avatar {
						display: inline-block;
						width: 50rpx;
						height: 50rpx;
						margin-right: 10rpx;
						border-radius: 50%;
					}
					.username {
						font-size: 24rpx;
						font-weight: 400;
						color: #000000;
					}
				}
				.select-wrap {
					display: flex;
					.phone {
						height: 50rpx;
						line-height: 50rpx;
						font-size: 28rpx;
						font-weight: bold;
						color: #000000;
						vertical-align: middle;
					}
					.btn-select,.btn-feedback {
						display: inline-block;
						width: 80rpx;
						height: 44rpx;
						margin-left: 15rpx;
						line-height: 44rpx;
						background: #FFFFFF;
						border: 1rpx solid #CCCCCC;
						border-radius: 10rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #333333;
						text-align: center;
						vertical-align: middle;
					}
					.btn-feedback {
						width: 120rpx;
						height: 50rpx;
						line-height: 50rpx;
						padding: 0;
						&[disabled] {
							color: #AAAAAA;
							background: #EFEFEF;
						}
					}
					.icon-wrap {
						height:	50rpx;
						vertical-align: middle;
						.icon-select {
							display: inline-block;
							width: 31rpx;
							height: 31rpx;
							margin-left: 15rpx;
						}
					}
				}
				.label {
					width: 360rpx;
					font-size: 22rpx;
					text-align: right;
					font-weight: 400;
					color: #999999;
				}
			}
			.item-handler-wrap {
				display: flex;
				padding-top: 20rpx;
				justify-content: space-around;
				align-items: center;
				.item-handler {
					display: inline-block;
					// height: 50rpx;
					line-height: 48rpx;
					background: #FFFFFF;
					border: 1rpx solid #CCCCCC;
					border-radius: 10rpx;
					text-align: center;
					box-sizing: border-box;
					padding: 0;
					&::after {
						border: none;
					}
					&.item-handler-arrive,&.item-handler-breach {
					}
					&[disabled] {
						color: #AAAAAA;
						background: #EFEFEF;
					}
					&.item-handler-phone,&.item-handler-copy {
						width: 160rpx;
						margin-right: 20rpx;
					}
					&.item-handler-arrive {
						width: 130rpx;
						margin-right: 20rpx;
					}
					&.item-handler-breach {
						width: 130rpx;
					}
					&.item-handler-feedback {
						width: 130rpx;
					}
					&.item-confirm {
						// width: 100%;
						flex: 1;
						margin-right: 0;
					}
					.icon {
						display: inline-block;
						margin-right: 10rpx;
					}
					.icon-handler-phone {
						width: 17rpx;
						height: 17rpx;
					}
					.icon-handler-copy {
						width: 18rpx;
						height: 18rpx;
					}
					.icon-handler-arrive {
						width: 15rpx;
						height: 18rpx;
					}
					.icon-handler-breach {
						width: 15rpx;
						height: 18rpx;
					}
					.icon-handler-feedback {
						width: 18rpx;
						height: 17rpx;
						// margin-right: 20rpx;
					}
					.text {
						height: 50rpx;
						line-height: 50rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #000000;
					}
				}
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
	
	
</style>
