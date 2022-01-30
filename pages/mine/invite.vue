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
				>我应邀的</text>
			</view>
		</u-navbar>
		
		<view class="content">
			
			<!-- <view :class="[ isTabsMenuShow ? 'tabs-menu-wrap show' : 'tabs-menu-wrap' ]"> -->
			<u-sticky :offset-top="CustomBar">
			
				<u-tabs ref="tabMenu" :list="tabMenu" :current="current" @change="tabChange" lineColor="#FF748C"
					:activeStyle="{ color: '#645DAF', 'font-weight': 'bold'}" :inactiveStyle="{ color: '#000000'}" :itemStyle="{'height': '44px','background': '#ffffff'}">
				</u-tabs>
				
			</u-sticky>
			<!-- </view> -->
			
			
			
			<view class="tabs-list-wrap">
				<!-- 显示区域 -->
				<swiper :class="{'swiper-list-wrap': true,'swiper-disabled': !isTabsMenuShow, 'swiper-min-height': isTabsMenuShow}" duration="300" @change="swiperChange" :current="current"
					:style="{'height': swiperHeight +'px','--swiper-min-height':swiperMinHeight + 'px'}">
					
					<block v-for="(item,index) in tabContent" :key="index" :data-id="index">
						<swiper-item>
							
							<view :class="'tab-content inviting-list-wrap tabContent_'+index">
								
								<block v-if="item.data.length">
									
									
									<view class="item-inviting" v-for="(item1,index1) in item.data" :key="index1" @click="toPage(item1.id)">
										<view class="theme-name">
											<image class="avatar" :src="item1.avatar || '../../static/avatar.png'" mode=""></image>
											<text class="title">{{item1.title}}</text></view>
										<view class="inviting-info">
											<view class="item-info">
												<image class="icon icon-clock" src="../../static/icon-clock.png" mode=""></image>
												<text class="text">{{item1.inviteDate}}</text>
											</view>
											<view class="item-info">
												<image class="icon icon-location" src="../../static/icon-location.png" mode=""></image>
												<text class="text">{{item1.address}}</text>
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
									
									<view class="tips">暂时没有数据...</view>
									
								</block>
															
							</view>
						
						</swiper-item>
					</block>
				</swiper>
			</view>
				
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 1待选择 2已被选中 3未被选中 4已完成
				tabMenu: [{
					'name': '待选择',
					'value': 1,
				},{
					'name': '已被选中',
					'value': 2,
				},{
					'name': '未被选中',
					'value': 3,
				},{
					'name': '已完成',
					'value': 4,
				}],
				tabContent: [],
				current: 0, //tabs索引
				swiperHeight: 0, //swiperHeight高度
				swiperMinHeight: 0, //swiperMinHeight高度
				CustomBar: this.CustomBar,
				
				firstLoading: true, //是否首次加载
				recommendData: {}, //推荐数据
				
			}
		},
		onLoad() {
			
			
			uni.getSystemInfo({
			    success: (res)=> {
			        this.swiperMinHeight = res.windowHeight - this.CustomBar - 44 //获取系统信息，可使用窗口的高度
			    }
			});
			
			// this.getMyBeInviteOrderList();
			
			this.goodsCategoryContent(this.current);
			
			// this.$refs.tabMenu.init();
		},
		updated() {
			// this.getStickyTop();
			
			this.initSwiperHeight(".tabContent_" + this.current);
		},
		watch: {
			current: function(){
				this.goodsCategoryContent(this.current);
			}
		},
		methods: {
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
			//分类内容
			async goodsCategoryContent(index) {
			
				//首次进入
				if (this.firstLoading) {
					this.firstLoading = false;
					let id = await this.getCatId();
					//推荐
					let query = {
						type: id,
						pageNum: 1,
						pageSize: 10
					}
					
					console.log(query);
			
					let res = await uni.$http.get(uni.$url.getMyBeInviteOrderList, query);
			
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
					
					console.log(arrData);
			
					this.tabContent = arrData;
			
				} else {
					if (JSON.stringify(this.tabContent[index]['data']) == '[]') {
			
						let id = this.getCatId();
						//推荐
						let query = {
							type: id,
							pageNum: 1,
							pageSize: 10
						}
			
						let res = await uni.$http.get(uni.$url.getMyBeInviteOrderList, query);
			
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
					type: id,
					pageNum: ++this.tabContent[index]['pageNum'],
					pageSize: 10
				}
			
				// 发起请求
				const res = await uni.$http.get(uni.$url.getMyBeInviteOrderList, query)
			
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
			
				// ** 关闭节流阀
				this.isloading = false
			
				// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				this.tabContent[index]['data'] = [...this.tabContent[index]['data'], ...res.data.rows]
			
				// this.total = res.message.total
				this.$forceUpdate();
			
				this.initSwiperHeight('.tabContent_' + this.current);
			
			},
			// 触底的事件
			onReachBottom() {
			
				// 判断是否正在请求其它数据，如果是，则不发起额外的请求
				if (this.isloading) return
				// 让页码值自增 +1
				// this.queryObj.pagenum += 1
				// 重新获取列表数据
				let catId = this.getCatId();
			
				this.getCategoryData(this.current, catId);
			},
			//根据索引（this.TabCur）获取catId
			getCatId() {
				let catId = '';
			
				for (var i = 0; i < this.tabMenu.length; i++) {
			
					if (this.current == i) {
			
						catId = this.tabMenu[i].value;
					}
				}
				console.log({catId})
				return catId;
			
			},
			toPage(id) {
				
				uni.navigateTo({
					url: '/pages/date/mine-detail?id=' + id
				})
				
			}
		}
	}
</script>

<style lang="scss">
	
	page {
		background: #f1eff2;
	}
	
	.left-wrap {
		display: flex;
		.navbar-left-text {
			color: #FFFFFF;
		}
	}
	
	
	.tabs-menu-wrap {
		display: none;
		transition: 0.5s;
	
		&.show {
			display: block;
		}
	}
	
	
	.inviting-list-wrap {
		// height: 100%;
		padding: 30rpx 30rpx 44rpx 30rpx;
		// overflow: auto;
		box-sizing: border-box;
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
		.tips {
			margin-top: 50%;
			text-align: center;
		}
	}
	
	
</style>
