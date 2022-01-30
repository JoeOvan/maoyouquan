<template>
	<view class="wrapper">
		<u-popup :show="isShow" mode="bottom" @close="close" @open="open" :closeable="true">
			<view class="pay-modal-wrap">
				<view class="title">邀约发布小费</view>
				<view class="amount-wrap">
					<text class="sign">￥</text>
					<text class="amount">{{amount}}</text>
				</view>
				<view class="tips">
					平台收取的邀约金为一次性服务费用，<br>
					如果此次服务未能顺利匹配将自动退还
				</view>
				<button class="btn-pay" @click="toPay">使用微信支付</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"pay-cash-modal",
		data() {
			return {
				amount: 0,
			};
		},
		props: {
			isShow: {
				type: Number,
				default: false
			},
			orderSn: {
				type: [Number,String],
				default: null,
			},
			columnId: {
				type: [Number,String],
				default: null,
			}
		},
		mounted() {
			
		},
		watch:{
			isShow(){
				if(this.isShow) return this.getAmount();
			}
		},
		methods: {
			open() {
				// console.log('open');
			},
			close() {
				this.$emit('close');
			},
			async getAmount() {
				
				let res = await uni.$http.get(uni.$url.getInviteCash, { columnId: this.columnId });
				
				if(res.data.code == 401) {
					
					uni.navigateTo({
						url: '/pages/login/login'
					})
					
					return
					
				}
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				this.amount = res.data.data;
				
			},
			async toPay() {
				
				// 订单预支付
				// 发起请求获取订单的支付信息
				const res2 = await uni.$http.post(uni.$url.payWxInvite, { orderSn: this.orderSn });
				
				// 预付订单生成失败
				if (res2.data.code !== 200) return uni.$showMsg(res2.data.msg, 3500);
				
				// 得到订单支付相关的必要参数
				const payInfo = res2.data.data
							
				// 真实支付
				// 发起微信支付
				// 调用 uni.requestPayment() 发起微信支付
				const [err1, succ1] = await uni.requestPayment(payInfo)

				// 未完成支付
				if (err1) {
					uni.$showMsg('订单未支付！');
					// uni.redirectTo({
					// 	url: "/pages/date/detail?id=" + res.data.data.id
					// })
					uni.switchTab({
						url: "/pages/index/index"
					})
					return
				}
		
				uni.showToast({
					title: '支付完成！',
					icon: 'success'
				})
				
				
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
							
							let tmplIds1 = 'Sr5nyEickqWrcd1w2YDL2Oa_n41N53y8ftc60ulzylw';	//活动提醒
							let tmplIds2 = 'Rk90fo2ud01CGaGmJxLH3uUx28TvzUI_dpcyJkHzaEA';	//达到最大应邀人数通知
							let tmplIds3 = 'HQ0vpAWW38l_6WAtm_V6qHhlFZchieYHgzr_sdgw6b8';	//工单过期通知
							uni.requestSubscribeMessage({
								tmplIds: [tmplIds1,tmplIds2,tmplIds3],
								success: async res => {
									console.log('成功授权------',res);
									if(res[tmplIds1]=='accept') {
										// 活动提醒
										uni.setStorageSync('acceptSubscribeMessageActivityRemind', true);
									}
									if(res[tmplIds2]=='accept') {
										//达到最大应邀人数通知
										uni.setStorageSync('acceptSubscribeMessageSelectUserRemind', true);
									}
									if(res[tmplIds3]=='accept') {
										//工单过期通知
										uni.setStorageSync('acceptSubscribeMessageOrderExpiredRemind', true);
									}
									
									let query = {
									  "orderSn": _this.orderSn,
									  "activityRemind": uni.getStorageSync('acceptSubscribeMessageActivityRemind') ? true : false,
									  "orderExpiredRemind": uni.getStorageSync('acceptSubscribeMessageOrderExpiredRemind') ? true : false,
									  "selectUserRemind": uni.getStorageSync('acceptSubscribeMessageSelectUserRemind') ? true : false
									}
									
									console.log(query);
									
									let res3 = await uni.$http.post(uni.$url.inviteAuthSuccess, query);
									if (res3.data.code !== 200) return uni.$showMsg(res3.data.msg);
									uni.$showMsg(res3.data.msg);
									
								},
								fail: res => {
									uni.removeStorageSync('acceptSubscribeMessageActivityRemind');
									uni.removeStorageSync('acceptSubscribeMessageOrderExpiredRemind');
									uni.removeStorageSync('acceptSubscribeMessageSelectUserRemind');
									console.log(res);
								},
								complete:res=>{
									console.log('我被点了')
									
									uni.redirectTo({
										url: "/pages/date/mine-detail?id=" + _this.orderSn
									})
									
								}
							});
						}
					}
				})
				
							
			}
		}
	}
</script>

<style lang="scss">
	
	.pay-modal-wrap {
		padding: 80rpx 0 90rpx 0;
		text-align: center;
		.title {
			font-size: 34rpx;
			font-weight: 400;
			color: #000000;
		}
		.amount-wrap {
			display: inline-block;
			width: 300rpx;
			height: 100rpx;
			line-height: 100rpx;
			margin: 45rpx auto 40rpx auto;
			background: #F0F0F0;
			font-weight: 400;
			color: #FF3661;
			.sign {
				font-size: 34rpx;
			}
			.amount {
				font-size: 48rpx;
			}
		}
		.tips {
			margin-bottom: 75rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
			line-height: 36rpx;
		}
		.btn-pay {
			display: inline-block;
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			color: #FFFFFF;
			background: #07C160;
			border-radius: 10rpx;
			font-size: 34rpx;
			font-weight: bold;
		}
	}

</style>
