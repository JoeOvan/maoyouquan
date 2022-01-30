<template>
	<view class="wrapper">
		<u-popup :show="isShow" mode="bottom" @close="close" @open="open" :closeable="true">
			<view class="pay-modal-wrap">
				<view class="amount-wrap">
					<text class="amount">提现金额：¥{{amount}}</text>
				</view>
				<view class="tips">
					*提现后3-7个工作日到账，请耐心等待！
				</view>
				<button class="btn-pay" @click="toPay">提现到微信</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"get-cash-modal",
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
				
				let res = await uni.$http.get(uni.$url.getCashMargin);
				
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
				const res2 = await uni.$http.post(uni.$url.getCash);
				
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
					 
					 return 
				}
				
				uni.showToast({
					title: '支付完成！',
					icon: 'success'
				})
				
				this.$emit('close');
				
				this.$emit('updateData');
				
			}
		}
	}
</script>

<style lang="scss">
	
	.pay-modal-wrap {
		padding: 156rpx 0 90rpx 0;
		text-align: center;
		.amount-wrap {
			display: inline-block;
			width: 400rpx;
			height: 100rpx;
			line-height: 100rpx;
			margin: 45rpx auto 0 auto;
			background: #F0F0F0;
			font-size: 34rpx;
			font-weight: 400;
			color: #000000;
		}
		.tips {
			margin: 45rpx auto 75rpx auto;
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
