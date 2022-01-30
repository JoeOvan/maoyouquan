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


		<u-sticky class="tabs-sticky" :offset-top="navigationBarHeight" bgColor="#ffffff">
			<view class="tabs-menu-wrap">
				<u-tabs ref="tabMenu" :list="tabMenu" :current="current" @change="tabChange" lineColor="#FF748C"
					:activeStyle="{ color: '#645DAF', 'font-weight': 'bold'}" :inactiveStyle="{ color: '#000000'}">
				</u-tabs>
			</view>
		</u-sticky>


		<view class="tabs-list-wrap">
			<!-- 显示区域 -->
			<swiper :class="{'swiper-list-wrap': true,'swiper-disabled': !isTabsMenuShow, 'swiper-min-height': isTabsMenuShow}" duration="300" @change="swiperChange" :current="current"
				:style="{'height': windowHeight +'px','--swiper-min-height':swiperMinHeight + 'px'}">
				<block v-for="(item,index) in tabContent" :key="index" :data-id="index">
					<swiper-item>
						
						<scroll-view class="swiper-topic-list inviting-list-wrap" scroll-y="true" :style="{'height': windowHeight + 'px'}" @scrolltolower="loadMore()" lower-threshold="100"  refresher-enabled="true" :refresher-triggered="triggered"
						:refresher-threshold="100" refresher-background="light" @refresherpulling="onPulling"
						@refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort">
						
						<!-- <view class="inviting-list-wrap" :style="{'height': windowHeight +'px'}"> -->
							
							
							<view :class="'tab-content tabContent_'+index">
								
								<block v-if="item.data.length || item.recommendList.length">
									
									
									<view class="item-inviting" v-for="(item1,index1) in item.data" :key="index1" @click="toInvitePage(item1.id)">
										<view class="theme-name">
											<image class="avatar" :src="item1.avatar || '../../static/avatar.png'"></image>
											<text class="title">{{item1.title}}</text>
										</view>
										<view class="inviting-info">
											<view class="item-info">
												<image class="icon icon-clock" src="../../static/icon-clock.png" mode=""></image>
												<text class="text">{{item1.inviteDate | formatData}}</text>
											</view>
											<view class="item-info">
												<image class="icon icon-location" src="../../static/icon-location.png" mode=""></image>
												<text class="text">{{item1.address}}({{item1.distance | transformDistance}})</text>
											</view>
											<view class="item-info">
												<image class="icon icon-gender" src="../../static/icon-gender.png" mode=""></image>
												<text
													class="text">{{item1.beInviteSex | transformGender}}&nbsp;&nbsp;{{item1.beInviteAge | transformAge}}</text>
											</view>
										</view>
										<view class="publish-info">
											<view class="tag-wrap">
												<view class="item-tag">
													{{item1.beInviteNum}}人
												</view>
												<view class="item-tag">
													{{item1.consumerType | transformPay}}
												</view>
											</view>
											<view class="publish-time">
												发布于{{item1.createTime}}
											</view>
										</view>
									</view>
									
									<view class="recommend-tips-wrap" v-if="item.recommendList.length">
										<view class="tips">抱歉，没有更多的了</view>
										<view class="guess-you">
											<view class="like-wrap">
												<image class="icon-like" src="../../static/icon-like.png"></image>
												<text class="text">猜你喜欢</text>					
											</view>
										</view>
									</view>
									
									<view class="item-inviting" v-for="(item1,index1) in item.recommendList" :key="index1" @click="toInvitePage(item1.id)">
										<view class="theme-name">
											<image class="avatar" :src="item1.avatar || '../../static/avatar.png'"></image>
											<text class="title">{{item1.title}}</text>
										</view>
										<view class="inviting-info">
											<view class="item-info">
												<image class="icon icon-clock" src="../../static/icon-clock.png" mode=""></image>
												<text class="text">{{item1.inviteDate}}</text>
											</view>
											<view class="item-info">
												<image class="icon icon-location" src="../../static/icon-location.png" mode=""></image>
												<text class="text">{{item1.address}}({{item1.distance | transformDistance}})</text>
											</view>
											<view class="item-info">
												<image class="icon icon-gender" src="../../static/icon-gender.png" mode=""></image>
												<text
													class="text">{{item1.beInviteSex | transformGender}}&nbsp;&nbsp;{{item1.beInviteAge | transformAge}}</text>
											</view>
										</view>
										<view class="publish-info">
											<view class="tag-wrap">
												<view class="item-tag">
													{{item1.beInviteNum}}人
												</view>
												<view class="item-tag">
													{{item1.consumerType | transformPay}}
												</view>
											</view>
											<view class="publish-time">
												发布于{{item1.createTime}}
											</view>
										</view>
									</view>
															
									
								</block>
								
								<block v-else>
									
									<view class="tips-null">暂时没有数据...</view>
									
								</block>
								
						
							</view>
						
							
						<!-- </view> -->
						</scroll-view>
						
					</swiper-item>
				</block>
			</swiper>
		</view>

		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				bgColor: 'rgba(225, 225, 225, 0)',
				navigationBarHeight: this.CustomBar, //导航栏高度
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
				windowHeight: 0,
				
				isloading: false, // 是否正在请求数据
				triggered: false, //开启下拉刷新
				_freshing: false
				
			}
		},
		onLoad() {
			
			this._freshing = false;
			setTimeout(() => {  
				this.triggered = true;//触发onRefresh来加载自己的数据，如果不用这种方式，不要在此改变triggered的值  
			}, 1000)
			
            uni.getSystemInfo({
                success: (res)=> {
					this.windowHeight = res.windowHeight - this.CustomBar - 44
                    this.swiperMinHeight = res.windowHeight - this.CustomBar //获取系统信息，可使用窗口的高度
                }
            });
		},
		onShow() {
			this.getIndexLocation();
			
			this.getIndexColumnTwoLevelSelect();
			
		},
		mounted() {

		},
		updated() {
			// this.getStickyTop();
			
			this.initSwiperHeight(".tabContent_" + this.current);
		},
		watch: {
			current: function(){
				console.log(this.current);
				this.goodsCategoryContent(this.current);
			}
		},
		methods: {
			onPulling(e) {
			    // console.log("onpulling", e);  
			},  
			onRefresh() {  
			    if (this._freshing) return;  
			    this._freshing = true;  
				//界面下拉触发，triggered可能不是true，要设为true
			    if (!this.triggered) this.triggered = true;
				
				if(this.current == 0) this.firstLoading = true;
				
				this.goodsCategoryContent(this.current);
				
			    setTimeout(() => {  
			        this.triggered = false;//触发onRestore，并关闭刷新图标  
			        this._freshing = false;  
			    }, 1500)  
			},  
			onRestore() {  
			    console.log("onRestore");  
			},  
			onAbort() {  
			    console.log("onAbort");  
			},
			click(item) {
				console.log('item', item);
			},
			leftClick() {
				
				uni.navigateBack({
					delta: 1
				})
				
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

					} else  {
						
						this.initSwiperHeight(element);
						
					}

				}).exec();

			},
			async getIndexColumnTwoLevelSelect() {

				let res = await uni.$http.get(uni.$url.getIndexColumnTwoLevelSelect);

				this.tabMenu = res.data.data;

				if (!this.tabMenu) return this.tabMenu = [];

				this.tabMenu.forEach((item, index) => {

					item['name'] = item['label'];

				})

			},
			//分类内容
			async goodsCategoryContent(index) {

				//首次进入
				if (this.firstLoading) {
					this.firstLoading = false;
					let id = this.getCatId();
					//推荐
					let query = {
						columnId: id || '',
						pageNum: 1,
						pageSize: 10,
						lat: this.latitude,
						lon: this.longitude
					}

					let res = await uni.$http.get(uni.$url.getIndexOrderList, query);

					if (res.data.code !== 200) return uni.$showMsg(res.data.msg);

					this.recommendData = res.data;

					let contentCount = this.tabMenu.length;

					//请求数据并赋值给this.recommendData 没有数据的设置为空
					let arrData = {};
					for (let i = 0; i < contentCount; i++) {
						arrData[i] = {};
						if (i == index) {
							arrData[i]['data'] = this.recommendData.rows;
							arrData[i]['pageNum'] = 1;
							arrData[i]['pageSize'] = 10;
							arrData[i]['total'] = this.recommendData.total;
						} else {
							arrData[i]['data'] = [];
							arrData[i]['pageNum'] = null;
							arrData[i]['pageSize'] = null;
							arrData[i]['total'] = null;
							arrData[i]['recommendList'] = [];
						}
					}

					this.tabContent = arrData;

				} else {
					if (JSON.stringify(this.tabContent[index]['data']) == '[]') {

						let id = this.getCatId();
						//推荐
						let query = {
							columnId: id || '',
							pageNum: 1,
							pageSize: 10,
							lat: this.latitude,
							lon: this.longitude
						}

						let res = await uni.$http.get(uni.$url.getIndexOrderList, query);

						if (res.data.code !== 200) return uni.$showMsg(res.data.msg);

						let shopsData = res.data;

						//加载更多数据赋值给tabContent
						this.tabContent[index]['data'] = shopsData.rows;
						this.tabContent[index]['pageNum'] = 1
						this.tabContent[index]['pageSize'] = 10;
						this.tabContent[index]['total'] = shopsData.total;
						this.tabContent[index]['recommendList'] = shopsData.recommendList;

					}
				}

				this.$forceUpdate();

				this.initSwiperHeight('.tabContent_' + this.current);
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
					pageNum: ++this.tabContent[index]['pageNum'],
					pageSize: 10,
					lat: this.latitude,
					lon: this.longitude
				}

				// 发起请求
				const res = await uni.$http.get(uni.$url.getIndexOrderList, query)

				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);

				// ** 关闭节流阀
				this.isloading = false

				// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				this.tabContent[index]['data'] = [...this.tabContent[index]['data'], ...res.data.rows]

				// this.total = res.message.total
				this.$forceUpdate();

				this.initSwiperHeight('.tabContent_' + this.current);

			},
			//scroll-view 触底的事件
			loadMore() {
				console.log('加载更多')
				// 判断是否正在请求其它数据，如果是，则不发起额外的请求
				if (this.isloading) return
				// 让页码值自增 +1
				// this.queryObj.pagenum += 1
				// 重新获取列表数据
				let catId = this.getCatId();
						
				this.getCategoryData(this.current, catId);
				
			},
			// // 触底的事件
			// onReachBottom() {

			// 	// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			// 	if (this.isloading) return
			// 	// 让页码值自增 +1
			// 	// this.queryObj.pagenum += 1
			// 	// 重新获取列表数据
			// 	let catId = this.getCatId();

			// 	this.getCategoryData(this.current, catId);
			// },
			//根据索引（this.TabCur）获取catId
			getCatId() {
				let catId = '';

				for (var i = 0; i < this.tabMenu.length; i++) {

					if (this.current == i) {

						catId = this.tabMenu[i].value;
					}
				}

				return catId;

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

						that.goodsCategoryContent(that.current);

					}
				});

			},
			toPublish() {
				uni.navigateTo({
					url: "/pages/date/date"
				})
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
		},
		onPageScroll(e) {
			// e.scrollTop 获取页面的滚动高度
		},
		onPullDownRefresh() {
			console.log('refresh');
			
			// this.getIndexLocation();
			this.firstLoading = true;
			this.current = 0;
			
			this.goodsCategoryContent(this.current);
			
			this.getIndexColumnTwoLevelSelect();
			
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

	.wrapper {
		// padding-bottom: 50px;
	}

	.left-wrap {
		display: flex;
		.navbar-left-text {
			color: #FFFFFF;
		}
	}
	
	.tabs-list-wrap {
		position: relative;
		.swiper-min-height {
			min-height: var(--swiper-min-height) !important;
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
					margin-top: 15rpx;

					.icon-clock {
						display: inline-block;
					}
				}
			}

			.icon-wrap {}
		}
	}



	.inviting-list-wrap {
		padding: 20rpx 30rpx 0 30rpx;
		box-sizing: border-box;
		overflow: auto;
		.tab-content {
			width: 100%;
			// height: 100%;
			// overflow: auto;
		}
		.tips-null {
			width: 100%;
			height: 100%;
			margin-top: 50%;
			text-align: center;
		}
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
	
	
	.recommend-tips-wrap {
		height: 100rpx;
		padding: 80rpx 0;
		text-align: center;
		align-items: center;
		.tips {
			font-size: 24rpx;
			font-weight: 400;
			color: #000000;
		}
		.guess-you {
			// display: flex;
			position: relative;
			margin-top: 30rpx;
			text-align: center;
			&::before {
				position: absolute;
				top: 30rpx;
				left: 50%;
				margin-left: -215rpx;
				display: inline-block;
				content: ' ';
				width: 430rpx;
				height: 1rpx;
				background: #cccccc;
				z-index: 0;
			}
			.like-wrap {
				display: inline-block;
				width: 200rpx;
				padding: 0 30rpx;
				background: #f0f0f0;
				position: absolute;
				left: 50%;
				margin-left: -95rpx;
				z-index: 10;
				box-sizing: border-box;
				.icon-like {
					display: inline-block;
					width: 28rpx;
					height: 28rpx;
					margin-right: 15rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #666666;
					vertical-align: middle;
				}
				.text {
					font-size: 24rpx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #666666;
				}
			}
		}
	}
	
</style>
