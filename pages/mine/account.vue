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
				>我的账户</text>
			</view>
		</u-navbar>
		
		<view class="content">
			
			<view class="account-wrap">
				<view class="icon-wrap">
					<image class="icon-cash" src="../../static/icon-cash.png"></image>
					<text class="text">押金</text>
				</view>
				<view class="cash-wrap">
					<text class="sign">¥</text>
					<text class="total">{{totalCash}}</text>
					<text class="get-cash" @click="getCash">提现</text>
				</view>
			</view>
			
			<view class="tips">
				*活动进行中不能提现
			</view>
			
		</view>
		
		<get-cash-modal :isShow="isGetCashShow" @close="isGetCashShow = false" @updateData="getCashMargin"></get-cash-modal>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isGetCashShow: false,
				totalCash: 0,
			}
		},
		onShow() {
			this.getCashMargin();
		},
		methods: {
			leftClick() {
			
				uni.navigateBack({
					delta: 1
				})
			
			},
			async getCashMargin() {
				
				let res = await uni.$http.get(uni.$url.getCashMargin);
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				this.totalCash = res.data.data;
				
			},
			getCash() {
				
				if (this.totalCash <= 0) return uni.$showMsg('有钱才可提现哦');
				
				this.isGetCashShow = true;
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	page {
		background: #f1eff2;
	}
	
	.left-wrap {
		display: flex;
		.navbar-left-text {
			color: #FFFFFF;
		}
	}
	

	.account-wrap {
		display: flex;
		width: 690rpx;
		height: 200rpx;
		margin: 30rpx auto;
		background: #FFFFFF;
		box-shadow: 0 10rpx 20rpx 0 rgba(0, 0, 0, 0.1);
		border-radius: 30rpx;
		justify-content: space-between;
		align-items: center;
		.icon-wrap {
			display: flex;
			width: 295rpx;
			height: 80rpx;
			justify-content: center;
			align-items: center;
			flex-shrink: 0;
			border-right: 1rpx solid #DDDDDD;
			.icon-cash {
				display: inline-block;
				width: 28rpx;
				height: 24rpx;
				margin-right: 10rpx;
			}
			.text {
				font-size: 30rpx;
				font-weight: 400;
				color: #000000;
			}
		}
		.cash-wrap {
			display: flex;
			width: 395rpx;
			height: 80rpx;
			justify-content: center;
			align-items: center;
			.sign {
				font-size: 34rpx;
				font-weight: 400;
				color: #FF3661;
				margin: 15rpx 10rpx 0 0;
				vertical-align: bottom;
			}
			.total {
				font-size: 48rpx;
				font-weight: 400;
				color: #FF3661;
			}
			.get-cash {
				margin: 10rpx 0 0 30rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #888888;
			}
		}
	}
	
	.tips {
		margin-top: 60rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
		text-align: center;
	}
	
</style>
