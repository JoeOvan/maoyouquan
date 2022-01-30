<template>
	<view class="wrapper">
		<u-navbar class="nav-wrap" safeAreaInsetTop fixed :bgColor="bgColor" @rightClick="rightClick">
			<view slot="left">
				<text class="u-navbar__content__left__text navbar-left-text" @leftClick="leftClick">茂友圈</text>
			</view>
		</u-navbar>

		<view class="invite-wrap">

			<view class="publish-wrap">
				<image class="bg-index" src="../../static/bg_index.png"></image>
				<view class="publish-input" @click="toPublish">
					<view class="icon-wrap" slot="prefix">
						<image class="icon icon-invite-time" src="../../static/icon-invite-clock.png" mode=""></image>
					</view>
					<input class="input-text" type="text" placeholder="请输入邀约时间">
				</view>
				<view class="publish-input" @click="toPublish">
					<view class="icon-wrap" slot="prefix">
						<image class="icon icon-invite-address" src="../../static/icon-invite-location.png" mode=""></image>
					</view>
					<input class="input-text" type="text" placeholder="请输入邀约地址">
				</view>

			</view>


			<view :class="[ isPublishFixed ? 'btn-publish fixed-top' : 'btn-publish fixed-bottom' ]" @click="toPublish">
				<view class="icon-wrap">
					<image src="../../static/icon-go.png" mode="" class="icon icon-publish"></image>
				</view>
				<text class="text">发布邀约</text>
			</view>


			<!-- 进行中的邀约 -->
			<view class="inviting-wrap" v-if="invitingData.length">
				<view class="title">你有<text class="text">{{invitingData.length}}</text>个进行中的邀约</view>
				<block v-for="(item,index) in invitingData" :key='index'>
					<view :class="[ item.isToday ? 'inviting-info inviting' : 'inviting-info']" @click="toMineInvitePage(item.id)">
						<view class="theme-wrap">
							<view class="theme-name">{{item.title}} <text class="text"></text></view>
							<view class="date">
								<image class="icon-clock" src="../../static/icon-clock.png"></image>
								<text class="text">{{item.inviteDate | formatData}}</text>
							</view>
						</view>
						<view class="icon-wrap">
							<u-icon size="15" name="arrow-right"></u-icon>
						</view>
					</view>
				</block>
			</view>

		</view>
		
		
		
		<view class="inviting-list-wrap">
			
			
			<view class="item-inviting" v-for="(item,index) in recommendData" :key="index" @click="toInvitePage(item.id)">
				<view class="theme-name">
					<image class="avatar" :src="item.avatar || '../../static/avatar.png'"></image>
					<text class="title">{{item.title}}</text>
				</view>
				<view class="inviting-info">
					<view class="item-info">
						<image class="icon icon-clock" src="../../static/icon-clock.png" mode=""></image>
						<text class="text">{{item.inviteDate | formatData}}</text>
					</view>
					<view class="item-info">
						<image class="icon icon-location" src="../../static/icon-location.png" mode=""></image>
						<text class="text">{{item.address}}({{item.distance | transformDistance}})</text>
					</view>
					<view class="item-info">
						<image class="icon icon-gender" src="../../static/icon-gender.png" mode=""></image>
						<text
							class="text">{{item.beInviteSex | transformGender}}&nbsp;&nbsp;{{item.beInviteAge | transformAge}}</text>
					</view>
				</view>
				<view class="publish-info">
					<view class="tag-wrap">
						<view class="item-tag">
							{{item.beInviteNum}}人
						</view>
						<view class="item-tag">
							{{item.consumerType | transformPay}}
						</view>
					</view>
					<view class="publish-time">
						发布于{{item.createTime}}
					</view>
				</view>
			</view>
			
			<view class="more-wrap" v-if="recommendData.length" @click="toMore">
				<u-loadmore :status="status" nomoreText="点击查看更多"/>
			</view>
			
		</view>
		

	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				bgColor: 'rgba(225, 225, 225, 0)',
				navigationBarHeight: this.CustomBar - 2 + 'px', //导航栏高度
				stickyTop: 0, //吸顶高度
				isPublishFixed: true, //发布按钮是否吸顶
				btnPublishTop: 0, //发布按钮距离顶部高度
				tabMenu: [],
				tabContent: {}, //tab列表内容
				current: 0, //tabs索引
				swiperHeight: 0, //swiperHeight高度

				isTabsMenuShow: false, //tabs是否显示

				firstLoading: true, //是否首次加载
				recommendData: {}, //推荐数据

				longitude: '', //经度
				latitude: '', //纬度
				
				invitingData: [], //邀约中的数据
				swiperMinHeight: 0, //最小高度
				
			}
		},
		onLoad() {

		},
		onShow() {
			this.getIndexLocation();
			
			this.getIndexMyOrderList();
		},
		mounted() {

			this.getBtnPublishTop();

		},
		updated() {
			this.getStickyTop();
			
			this.initSwiperHeight(".tabContent_" + this.current);
		},
		// watch: {
		// 	current: function(){
		// 		this.goodsCategoryContent(this.current);
		// 	}
		// },
		methods: {
			click(item) {
				console.log('item', item);
			},
			rightClick() {
				console.log('rightClick');
			},
			leftClick() {
				console.log('leftClick');
			},
			getStickyTop() {

				uni.createSelectorQuery().in(this).select('.invite-wrap').boundingClientRect(result => {

					this.stickyTop = result.height;

				}).exec();

			},
			getBtnPublishTop() {

				uni.createSelectorQuery().in(this).select('.btn-publish').boundingClientRect(result => {
					this.btnPublishTop = result.top;

				}).exec();

			},
			tabChange(e) {
				console.log(e);

				this.current = e.index;

				// this.goodsCategoryContent(this.current);
			},
			swiperChange(e) {
				console.log(e);

				this.current = e.detail.current;

				// this.goodsCategoryContent(this.current);
			},
			//动态获取高度
			initSwiperHeight(element) {
				
				uni.createSelectorQuery().in(this).select(element).boundingClientRect(result => {

					if (result && result.height > 0) {

						this.swiperHeight = result.height;

					}
					
				}).exec();

			},
			//分类内容
			async goodsCategoryContent() {
				
				
				let query = {
					columnId: '',
					pageNum: 1,
					pageSize: 5,
					lat: this.latitude,
					lon: this.longitude
				}
				
				let res = await uni.$http.get(uni.$url.getIndexOrderList, query);
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				this.recommendData = res.data.rows;
				
			},
			// 获取商品列表数据的方法
			async getCategoryData(index, id) {

				let pageNum = this.tabContent[index]['pageNum'];
				let pageSize = this.tabContent[index]['pageSize'];
				let total = this.tabContent[index]['total'];

				// 判断是否还有下一页数据
				if (pageNum * pageSize >= total) return uni.$showMsg('到底了，没有了！');
				// ** 打开节流阀
				this.isloading = true

				let query = {
					columnId: id || '',
					pageNum: 1,
					pageSize: 10,
					lat: this.latitude,
					lon: this.longitude
				}

				// 发起请求
				const res = await uni.$http.get(uni.$url.getIndexOrderList, query);

				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);

				// ** 关闭节流阀
				this.isloading = false

				// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				this.tabContent[index]['data'] = [...this.tabContent[index]['data'], ...res.data.rows]

				// this.total = res.message.total
				this.$forceUpdate();

			},
			// 触底的事件
			onReachBottom() {

			},
			async getIndexLocation() {

				let that = this;
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);

						that.longitude = res.longitude;
						that.latitude = res.latitude;

						that.goodsCategoryContent();

					}
				});

			},
			toPublish() {
				uni.navigateTo({
					url: "/pages/date/date"
				})
			},
			async getIndexMyOrderList() {
				
				// 发起请求
				const res = await uni.$http.get(uni.$url.getIndexMyOrderList)
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				this.invitingData = res.data.data;
				
				this.invitingData.forEach(item => {
					
					item['isToday'] = this.isTodayFilter(item.inviteDate);
					
				});
			
			},
			isTodayFilter(date) {
				if(!date) return;
				
				let splitDate = date.split(" ");
				let tempDate = splitDate[0];
				
				const time = new Date(new Date().setDate((new Date().getDate())));
				const year = time.getFullYear();
				const month = `0${time.getMonth() + 1}`.slice(-2);
				const strDate = `0${time.getDate()}`.slice(-2);
				const todayDate = `${year}-${month}-${strDate}`;
				
				if(tempDate == todayDate) {
					return true
				} else {
					return false
				}
			},
			toInvitePage(id) {
				
				uni.navigateTo({
					url: '/pages/date/detail?id='+id
				})
				
			},
			toMineInvitePage(id) {
				
				uni.navigateTo({
					url: '/pages/date/mine-detail?id='+id
				})
				
			},
			toMore() {
				
				uni.navigateTo({
					url: '/pages/category/category'
				})
				
			}
		},
		onPageScroll(e) {
			// e.scrollTop 获取页面的滚动高度
			// console.log(e.scrollTop,  e.scrollTop >= this.stickyTop )
			this.bgColor = e.scrollTop >= this.stickyTop ? '#37277B' : 'rgba(225, 225, 225, 0)';

			this.isTabsMenuShow = e.scrollTop >= this.stickyTop - this.CustomBar;
			// this.isTabsMenuShow = e.scrollTop >= this.stickyTop -100;

			//初始化tabs滑块
			// if (this.isTabsMenuShow) this.$refs.tabMenu.init();

			this.isPublishFixed = e.scrollTop <= this.btnPublishTop - this.CustomBar ? true : false;
		},
		onPullDownRefresh() {
			console.log('refresh');
			
			this.getIndexMyOrderList();
			
			this.goodsCategoryContent();
			
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		//微信小程序分享到朋友圈功能
		onShareTimeline: function (res) {
			return {
			  title: '茂友圈',
			  path: 'pages/index/index', // 显示的页面
			}
		// }
		},
		//微信小程序分享功能
		onShareAppMessage: function (res) {
			return {
			  title: '茂友圈',
			  path: 'pages/index/index', // 显示的页面
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: #f0f0f0;
	}

	.wrapper {
		// padding-bottom: 50px;
	}

	.u-navbar--fixed {
		background: linear-gradient(360deg, rgba(55, 39, 123, 0.30196) 0%, rgba(55, 39, 123, 1) 100%);
	}

	.navbar-left-text {
		color: #FFFFFF;
	}
	
	.tabs-list-wrap {
		position: relative;
		.swiper-min-height {
			min-height: var(--swiper-min-height) !important;
		}
	}


	.invite-wrap {
		.publish-wrap {
			position: relative;
			padding: 255rpx 125rpx 160rpx 125rpx;
			.bg-index {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 600rpx;
				z-index: 0;
			}
			.publish-input {
				display: flex;
				position: relative;
				margin-bottom: 15rpx;
				border: 3rpx solid #FFF600;
				box-shadow: 0 15rpx 30rpx 0 rgba(55, 39, 123, 0.5);
				border-radius: 10rpx;
				background: #FFFFFF;
				z-index: 10;
				.icon-wrap {
					display: flex;
					width: 90rpx;
					height: 80rpx;
					flex-shrink: 0;
					justify-content: center;
					align-items: center;

					.icon {
						display: inline-block;
					}

					.icon-invite-time {
						width: 30rpx;
						height: 30rpx;
					}

					.icon-invite-address {
						width: 26rpx;
						height: 32rpx;
					}
				}

				.input-text {
					height: 80rpx;
					line-height: 80rpx;
				}
			}
		}
	}


	.btn-publish {
		display: flex;
		width: 200rpx;
		height: 64rpx;
		background: #FFEA00;
		box-shadow: 0 8rpx 0 0 #FFAE00;
		border-radius: 10rpx;
		align-items: center;
		font-size: 30rpx;
		// transition: 0.5s;
		z-index: 1000;
		box-shadow: 0 15rpx 15rpx 0 rgba(255, 174, 0, 0.5), 0 8rpx 0 0 #FFAE00;
		border-radius: 40rpx;

		&.fixed-top {
			position: absolute;
			top: 465rpx;
			right: 125rpx;
		}

		&.fixed-bottom {
			position: fixed;
			// top: auto;
			top: 85%;
			bottom: 130rpx;
			right: 15rpx;
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
			color: #FF3661;
			font-weight: bold;
		}
	}


	.inviting-wrap {
		margin: 0 30rpx 20rpx 30rpx;
		padding: 30rpx 30rpx 0 30rpx;
		background: #FFFEEC;
		box-shadow: 0 10rpx 20rpx 0 rgba(0, 0, 0, 0.1);
		border-radius: 30rpx;

		.title {
			font-size: 30rpx;
			font-weight: bold;
			color: #333333;

			.text {
				display: inline-block;
				margin: 0 10rpx;
				color: #FF748C;
			}
		}

		.inviting-info {
			display: flex;
			padding: 25rpx 0;
			border-bottom: 1rpx solid #DDDDDD;
			justify-content: space-between;
			align-items: center;

			&:last-child {
				border: none;
			}

			&.inviting {
				.theme-wrap {
					.theme-name {
						color: #FF3661;
						.text {
							display: inline-block;
							font-size: 30rpx;
							font-weight: normal;
						}
					}
				}
			}

			.theme-wrap {
				.theme-name {
					font-size: 30rpx;
					font-weight: bold;
					color: #000000;
					.text {
						display: none;
					}
				}

				.date {
					line-height: 25rpx;
					margin-top: 10rpx;
					.icon-clock {
						display: inline-block;
						width: 18rpx;
						height: 18rpx;
						margin-right: 10rpx;
					}
					.text {
						font-size: 24rpx;
						font-weight: 400;
						color: #000000;
					}
				}
			}

			.icon-wrap {}
		}
	}


	.inviting-list-wrap {
		padding: 0 30rpx 20rpx 30rpx;
		.item-inviting {
			margin-bottom: 20rpx;
			padding: 30rpx;
			background: #FFFFFF;
			box-shadow: 0 10rpx 20rpx 0 rgba(51, 51, 51, 0.05);
			border-radius: 30rpx;

			.theme-name {
				font-size: 30rpx;
				font-weight: bold;
				color: #000000;
				.avatar {
					display: inline-block;
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
					margin-right: 10rpx;
					vertical-align: middle;
				}
			}

			.inviting-info {
				padding: 25rpx 0;

				.item-info {
					display: inline-block;
					width: 50%;
					font-size: 24rpx;
					vertical-align: top;
					.icon {
						display: inline-block;
						width: 18rpx;
						height: 18rpx;
						margin-right: 15rpx;
					}
				}
			}

			.publish-info {
				display: flex;
				justify-content: space-between;

				.tag-wrap {
					.item-tag {
						display: inline-block;
						padding: 5rpx 10rpx;
						margin-right: 10rpx;
						color: #666666;
						border: 1rpx solid #B5B5B5;
						border-radius: 6rpx;
						font-size: 22rpx;
					}
				}

				.publish-time {
					height: 45rpx;
					line-height: 45rpx;
					font-size: 22rpx;
					font-weight: 400;
					color: #999999;
				}
			}
		}

	}
	

	.more-wrap {
		margin-top: 30px;
	}

</style>
