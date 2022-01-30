<template>
	<view class="wrapper">

		<u-navbar class="nav-wrap" placeholder safeAreaInsetTop fixed bgColor="#37277B" @leftClick="leftClick">
			<view slot="left" class="left-wrap">
				<u-icon name="arrow-left" size="19" color="#ffffff"></u-icon>
				<text class="navbar-left-text">发布邀约</text>
			</view>
		</u-navbar>

		<view class="content">
			
			<image class="bg_date" src="../../static/bg_date.png"></image>

			<view class="tabs-wrap">
				<view :class="[ current == 0 ? 'item-tabs active': 'item-tabs']" @click="tabsChange(0)">
					<image class="icon icon-active" src="../../static/icon-party-active.png"></image>
					<image class="icon icon-no-active" src="../../static/icon-party.png"></image>
					<text class="text">约饭</text>
				</view>
				<view :class="[ current == 1 ? 'item-tabs active': 'item-tabs']" @click="tabsChange(1)">
					<image class="icon icon-active" src="../../static/icon-meeting-active.png"></image>
					<image class="icon icon-no-active" src="../../static/icon-meeting.png"></image>
					<text class="text">娱乐</text>
				</view>
			</view>

			<!-- 显示区域 -->
			<swiper class="swiper-list-wrap" duration="300" @change="swiperChange" :current="current"
				:style="{'height': swiperHeight +'px'}">
				<swiper-item>
					<view class="tab-content tabContent_0">

						<view class="inviting-info-wrap">
							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-theme" src="../../static/icon-invite-theme.png"></image>
								</view>
								<input v-model="partyTheme" type="text" class="input-text" placeholder="请输入邀约主题">
							</view>
							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-time" src="../../static/icon-invite-time.png"></image>
								</view>
								<picker mode="multiSelector" @change="onPartyTimePickerChange"
									@columnchange="onPartyTimePickerColumnChange" :value="partyIndex" :range="partyArray">
									<view class="picker-placeholder" v-if="isPartyPickerShow">
										<view class="input-text">请选择邀约时间</view>
									</view>
									<view class="picker" v-else>
										{{partyArray[0][partyIndex[0]]}}-{{partyArray[1][partyIndex[1]]}}:{{partyArray[2][partyIndex[2]]}}
									</view>
								</picker>
							</view>
							<view class="item-info" style="display: none;">
								<view class="icon-wrap">
									<image class="icon icon-invited-time" src="../../static/icon-invited-time.png"></image>
								</view>
								<picker mode="selector" @change="onPartyAbortPickerChange"
									@columnchange="bindMultiPickerColumnChange" :value="abortIndex" :range="abortArray"
									range-key="label">
									<view class="picker-placeholder" v-if="isPartyAbortPickerShow">
										<view class="input-text">请选择截止应约时间</view>
									</view>
									<view class="picker" v-else>
										{{abortArray[abortIndex].label}}
									</view>
								</picker>
							</view>
							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-address" src="../../static/icon-invite-address.png">
									</image>
								</view>
								<view class="map-wrap" @click="getMap">
									<text class="text" v-if="partyAddress">{{partyAddress}}</text>
									<text class="label" v-else>请选择地点</text>
								</view>
							</view>
							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-gender" src="../../static/icon-invite-gender.png">
									</image>
								</view>
								<picker mode="selector" @change="onPartyGenderPickerChange" :value="genderIndex"
									:range="genderArray" range-key="label">
									<view class="picker-placeholder" v-if="isPartyGenderPickerShow">
										<view class="input-text">应邀方性别</view>
									</view>
									<view class="picker" v-else>
										{{genderArray[genderIndex].label}}
									</view>
								</picker>
								<text class="line">|</text>
								<picker class="multi-column" mode="selector" @change="onPartyAgePickerChange"
									:value="ageIndex" :range="ageArray" range-key="label">
									<view class="picker-placeholder" v-if="isPartyAgePickerShow">
										<view class="input-text">应邀方年龄</view>
									</view>
									<view class="picker" v-else>
										{{ageArray[ageIndex].label}}
									</view>
								</picker>
							</view>
							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-pay" src="../../static/icon-invite-pay.png"></image>
								</view>
								<picker mode="selector" @change="onPartyPayPickerChange" :value="payIndex" :range="payArray"
									range-key="label">
									<view class="picker-placeholder" v-if="isPartyPayPickerShow">
										<view class="input-text">请选择消费方式</view>
									</view>
									<view class="picker" v-else>
										{{payArray[payIndex].label}}
									</view>
								</picker>
								<text v-if="!isPartyPayPickerShow && payIndex == 0" class="line">|</text>
								<input v-if="!isPartyPayPickerShow && payIndex == 0" v-model="partyConsume" type="number" class="input-text input-consume" placeholder="人均消费">
							</view>
							
							
							<view class="item-info item-count">
								
								<view class="label">应邀人数</view>
								
								<u-number-box v-model="partyInviteNum" @overlimit="onOverlimit" :min="1">
									<view slot="minus" class="minus">
										<u-icon name="minus" size="12"></u-icon>
									</view>
									<view slot="input" class="input"><input type="number" class="input-text"
											v-model="partyInviteNum" @focus="partyInviteNum = ''"><text class="text">人</text></view>
									<view slot="plus" class="plus">
										<u-icon name="plus" size="12"></u-icon>
									</view>
								</u-number-box>
							</view>
							
							<view class="item-info item-count">
								
								<view class="label">最低人数</view>
								
								<u-number-box v-model="partyMinInviteNum" @overlimit="onOverlimit" :min="1">
									<view slot="minus" class="minus">
										<u-icon name="minus" size="12"></u-icon>
									</view>
									<view slot="input" class="input"><input type="number" class="input-text"
											v-model="partyMinInviteNum" @focus="partyMinInviteNum = ''"><text class="text">人</text></view>
									<view slot="plus" class="plus">
										<u-icon name="plus" size="12"></u-icon>
									</view>
								</u-number-box>
							</view>

						</view>

					</view>
				</swiper-item>
				<swiper-item>
					<view class="tab-content tabContent_1">

						<view class="inviting-info-wrap">
							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-type" src="../../static/icon-invite-type.png"></image>
								</view>
								<picker mode="selector" @change="onMeetingTypePickerChange" :value="meetingTypeIndex"
									:range="meetingTypeArray" range-key="label">
									<view class="picker-placeholder" v-if="isMeetingTypePickerShow">
										<view class="input-text">请选择类型</view>
									</view>
									<view class="picker" v-else>
										{{meetingTypeArray[meetingTypeIndex].label}}
									</view>
								</picker>
							</view>
							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-theme" src="../../static/icon-invite-theme.png"></image>
								</view>
								<input type="text" v-model="meetingTheme" class="input-text" placeholder="请输入邀约主题">
							</view>
							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-time" src="../../static/icon-invite-time.png"></image>
								</view>
								<picker mode="multiSelector" @change="onMeetingTimePickerChange"
									@columnchange="onMeetingTimePickerColumnChange" :value="meetingTimeIndex"
									:range="meetingTimeArray">
									<view class="picker-placeholder" v-if="isMeetingTimePickerShow">
										<view class="input-text">请选择邀约时间</view>
									</view>
									<view class="picker" v-else>
										{{meetingTimeArray[0][meetingTimeIndex[0]]}}-{{meetingTimeArray[1][meetingTimeIndex[1]]}}:{{meetingTimeArray[2][meetingTimeIndex[2]]}}
									</view>
								</picker>
							</view>
							<view class="item-info" style="display: none;">
								<view class="icon-wrap">
									<image class="icon icon-invited-time" src="../../static/icon-invited-time.png"></image>
								</view>
								<picker mode="selector" @change="onMeetingAbortPickerChange" :value="meetingAbortIndex"
									:range="meetingAbortArray" range-key="label">
									<view class="picker-placeholder" v-if="isMeetingAbortPickerShow">
										<view class="input-text">请选择截止应约时间</view>
									</view>
									<view class="picker" v-else>
										{{meetingAbortArray[meetingAbortIndex].label}}
									</view>
								</picker>
							</view>
							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-address" src="../../static/icon-invite-address.png">
									</image>
								</view>
								<view class="map-wrap" @click="getMap">
									<text class="text" v-if="meetingAddress">{{meetingAddress}}</text>
									<text class="label" v-else>请选择地点</text>
								</view>
							</view>
							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-gender" src="../../static/icon-invite-gender.png">
									</image>
								</view>
								<picker mode="selector" @change="onMeetingGenderPickerChange" :value="meetingGenderIndex"
									:range="meetingGenderArray" range-key="label">
									<view class="picker-placeholder" v-if="isMeetingGenderPickerShow">
										<view class="input-text">应邀方性别</view>
									</view>
									<view class="picker" v-else>
										{{meetingGenderArray[meetingGenderIndex].label}}
									</view>
								</picker>
								<text class="line">|</text>
								<picker class="multi-column" mode="selector" @change="onMeetingAgePickerChange"
									:value="meetingAgeIndex" :range="meetingAgeArray" range-key="label">
									<view class="picker-placeholder" v-if="isMeetingAgePickerShow">
										<view class="input-text">应邀方年龄</view>
									</view>
									<view class="picker" v-else>
										{{meetingAgeArray[meetingAgeIndex].label}}
									</view>
								</picker>
							</view>
							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-pay" src="../../static/icon-invite-pay.png"></image>
								</view>
								<picker mode="selector" @change="onMeetingPayPickerChange" :value="meetingPayIndex"
									:range="meetingPayArray" range-key="label">
									<view class="picker-placeholder" v-if="isMeetingPayPickerShow">
										<view class="input-text">请选择消费方式</view>
									</view>
									<view class="picker" v-else>
										{{meetingPayArray[meetingPayIndex].label}}
									</view>
								</picker>
								
								<text class="line" v-if="!isMeetingPayPickerShow && meetingPayIndex == 0">|</text>
								<input v-if="!isMeetingPayPickerShow && meetingPayIndex == 0" v-model="meetingConsume" type="number" class="input-text input-consume" placeholder="人均消费">
							</view>

							<view class="item-info">
								<view class="icon-wrap">
									<image class="icon icon-invite-remark" src="../../static/icon-invite-remark.png">
									</image>
								</view>
								<input v-model="remark" type="text" class="input-text" placeholder="请输入备注">
							</view>
							
							
							<view class="item-info item-count">
								
								<view class="label">应邀人数</view>
								
								<u-number-box v-model="meetingInviteNum" @overlimit="onOverlimit" :min="1">
									<view slot="minus" class="minus">
										<u-icon name="minus" size="12"></u-icon>
									</view>
									<view slot="input" class="input"><input type="number" class="input-text"
											v-model="meetingInviteNum" @focus="meetingInviteNum = ''"><text class="text">人</text></view>
									<view slot="plus" class="plus">
										<u-icon name="plus" size="12"></u-icon>
									</view>
								</u-number-box>
								
							</view>
							
							<view class="item-info item-count">
								
								<view class="label">最低人数</view>
								
								<u-number-box v-model="meetingMinInviteNum" @overlimit="onOverlimit" :min="1">
									<view slot="minus" class="minus">
										<u-icon name="minus" size="12"></u-icon>
									</view>
									<view slot="input" class="input"><input type="number" class="input-text"
											v-model="meetingMinInviteNum" @focus="meetingMinInviteNum = ''"><text class="text">人</text></view>
									<view slot="plus" class="plus">
										<u-icon name="plus" size="12"></u-icon>
									</view>
								</u-number-box>
								
							</view>

						</view>

					</view>
				</swiper-item>
			</swiper>

		</view>

		<view class="publish-wrap">
			<!-- <button type="default" @click="subscribeMessageBeinvite">订阅邀约消息</button> -->
			<button class="btn-publish" :disabled="!isDisable" @click="addOrder">
				<view class="icon-wrap">
					<image src="../../static/icon-go.png" mode="" class="icon icon-publish"></image>
				</view>
				<text class="text">发布邀约</text>
			</button>
		</view>
		
		<pay-cash-modal :isShow="isPayCashShow" :columnId="columnId" :orderSn="orderSn" @close="closePayCashModal"></pay-cash-modal>

		<personal-modal :isShow="isPersonalShow" @close="isPersonalShow = false"></personal-modal>

	</view>
</template>

<script>
	import {
		debounce
	} from 'lodash'
	export default {
		data() {
			return {
				tabMenu: [{
					name: '测试1'
				}, {
					name: '测试2'
				}],
				current: 0, //tabs索引
				swiperHeight: 0, //swiperHeight高度
				
				isDisable: true,  //提交按钮是否禁用
				
				columnId: '', //栏目id

				isPersonalShow: false, //个人资料弹出窗
				isPayCashShow: false, //支付保证金提示框
				
				orderSn: '',  //订单号

				time: 0,

				partyInviteNum: 1,
				partyMinInviteNum: 1,
				meetingInviteNum: 1,
				meetingMinInviteNum: 1,

				partyTheme: '',

				//聚会应邀时间
				partyTypeId: 0,
				isPartyPickerShow: true,
				partyArray: [],
				partyIndex: [0, 0, 0],
				partyConsume: '',


				//应邀时间截止
				isPartyAbortPickerShow: false,
				abortArray: [{
						label: '应邀时间前半小时',
						value: 0
					},
					{
						label: '应邀时间前一小时',
						value: 1
					},
					{
						label: '应邀时间前两小时',
						value: 2
					},
					{
						label: '应邀时间前三小时',
						value: 3
					},
					{
						label: '应邀时间前四小时',
						value: 4
					},
					{
						label: '应邀时间前五小时',
						value: 5
					},
					{
						label: '应邀时间前六小时',
						value: 6
					},
					{
						label: '应邀时间前一天',
						value: 7
					}
				],
				abortIndex: 1,

				partyAddress: null, //聚会地址
				partyLatitude: 0, //纬度
				partyLongitude: 0, //经度

				//性别
				isPartyGenderPickerShow: true,
				genderArray: [{
						label: '不限',
						value: 0
					},
					{
						label: '男',
						value: 1
					},
					{
						label: '女',
						value: 2
					}
				],
				genderIndex: 0,


				//年龄段
				isPartyAgePickerShow: true,
				ageArray: [{
						label: '18-25岁',
						value: 1
					},
					{
						label: '25-30岁',
						value: 2
					},
					{
						label: '30-35岁',
						value: 3
					},
					{
						label: '35-40岁',
						value: 4
					},
					{
						label: '40-45岁',
						value: 5
					},
					{
						label: '45-50岁',
						value: 6
					},
					{
						label: '50岁以上',
						value: 7
					},
					{
						label: '不限',
						value: 8
					}
				],
				ageIndex: 0,

				//消费方式
				isPartyPayPickerShow: true,
				payArray: [{
						label: 'AA制',
						value: 0
					},
					{
						label: '邀约方全包',
						value: 1
					},
					{
						label: '应邀方全包',
						value: 2
					},
					{
						label: '其他',
						value: 3
					}
				],
				payIndex: 0,


				//===============娱乐=================


				meetingTheme: '',
				meetingAddress: null, //聚会地址
				meetingLatitude: 0, //纬度
				meetingLongitude: 0, //经度
				//类型
				isMeetingTypePickerShow: true,
				meetingTypeArray: [], //娱乐类型
				meetingTypeIndex: 0,
				


				//聚会应邀时间
				isMeetingTimePickerShow: true,
				meetingTimeArray: [],
				meetingTimeIndex: [0, 0, 0],
				meetingConsume: '',

				//应邀时间截止
				isMeetingAbortPickerShow: false,
				meetingAbortArray: [{
						label: '应邀时间前半小时',
						value: 0
					},
					{
						label: '应邀时间前一小时',
						value: 1
					},
					{
						label: '应邀时间前两小时',
						value: 2
					},
					{
						label: '应邀时间前三小时',
						value: 3
					},
					{
						label: '应邀时间前四小时',
						value: 4
					},
					{
						label: '应邀时间前五小时',
						value: 5
					},
					{
						label: '应邀时间前六小时',
						value: 6
					},
					{
						label: '应邀时间前一天',
						value: 7
					}
				],
				meetingAbortIndex: 1,

				meetingAddress: null, //聚会地址
				meetingLatitude: 0, //纬度
				meetingLongitude: 0, //经度

				//性别
				isMeetingGenderPickerShow: true,
				meetingGenderArray: [{
						label: '不限',
						value: 0
					},
					{
						label: '男',
						value: 1
					},
					{
						label: '女',
						value: 2
					}
				],
				meetingGenderIndex: 0,


				//年龄段
				isMeetingAgePickerShow: true,
				meetingAgeArray: [{
						label: '18-25岁',
						value: 1
					},
					{
						label: '25-30岁',
						value: 2
					},
					{
						label: '30-35岁',
						value: 3
					},
					{
						label: '35-40岁',
						value: 4
					},
					{
						label: '40-45岁',
						value: 5
					},
					{
						label: '45-50岁',
						value: 6
					},
					{
						label: '50岁以上',
						value: 7
					},
					{
						label: '不限',
						value: 8
					}
				],
				meetingAgeIndex: 0,

				//消费方式
				isMeetingPayPickerShow: true,
				meetingPayArray: [{
						label: 'AA制',
						value: 0
					},
					{
						label: '邀约方全包',
						value: 1
					},
					{
						label: '应邀方全包',
						value: 2
					},
					{
						label: '其他',
						value: 3
					}
				],
				meetingPayIndex: 0,
				remark: '',

			}
		},
		onLoad() {

			this.initData();

			this.getColumnSelect();

			this.initSwiperHeight(".tabContent_" + this.current);
		},
		onShow() {
			
		},
		updated() {
			this.initSwiperHeight(".tabContent_" + this.current);
		},
		onReady() {
			// 微信小程序需要用此写法
			// this.$refs.datetimePicker.setFormatter(this.formatter)
		},
		created() {
			// 按钮防抖
			this.addOrder = debounce(this.addOrder, 500)
		},
		methods: {
			leftClick() {

				uni.navigateBack({
					delta: 1
				})

			},
			initData() {

				this.partyArray[0] = this.getAfterDate();

				this.partyArray[1] = this.getHourTodayArray();

				this.partyArray[2] = this.getMinuteTodayArray();

				let date = new Date(new Date().setDate((new Date().getDate())));
				
				//1.5小时后 + 5分钟后 时间戳
				let newDate = (new Date(date).getTime()) + (1.5*60*60 + 5*60)*1000;
				// 时间戳转时间
				date = new Date(newDate.valueOf());
				
				// console.log(date);

				let hour = date.getHours();
				let minute = date.getMinutes();

				let hourIndex = this.partyArray[1].findIndex(item => item == hour);
				let minuteIndex = this.partyArray[2].findIndex(item => item == minute);

				// console.log(typeof hour,hourIndex,this.partyArray[1]);

				this.partyIndex = [0, hourIndex, minuteIndex];


				//=============娱乐==============

				this.meetingTimeArray[0] = this.getAfterDate();

				this.meetingTimeArray[1] = this.getHourTodayArray();

				this.meetingTimeArray[2] = this.getMinuteTodayArray();

				this.meetingTimeIndex = [0, hourIndex, minuteIndex];

				// console.log(this.partyArray)

			},
			getAfterDate() {

				const temp = [];
				for (let i = 0; i < 7; i++) {
					const time = new Date(new Date().setDate((new Date().getDate() + i)));
					const strDate = '';
					if (i == 0) {
						strDate = '今天'
					} else if (i == 1) {
						strDate = '明天'
					} else if (i == 2) {
						strDate = '后天'
					} else {
						strDate = `0${time.getDate()}`.slice(-2) + '日';
					}
					temp.push(`${strDate}`)
				}

				return temp;
			},
			getHourTodayArray() {
				let hourArr = [];
				let date = new Date(new Date().setDate((new Date().getDate())));
				//1.5小时后 + 5分钟后 时间戳
				let newDate = (new Date(date).getTime()) + (1.5*60*60 + 5*60)*1000;
				// 时间戳转时间
				date = new Date(newDate.valueOf());
				let hour = date.getHours();
				for (let i = hour; i <= 23; i++) {
					i = i < 10 ? '0' + i : i
					hourArr.push(String(i))
				}
				// console.log(hourArr)
				return hourArr
			},
			getMinuteTodayArray() {
				let minuteArr = [];
				let date = new Date(new Date().setDate((new Date().getDate())));
				//1.5小时后 + 5分钟后 时间戳
				let newDate = (new Date(date).getTime()) + (1.5*60*60 + 5*60)*1000;
				// 时间戳转时间
				date = new Date(newDate.valueOf());
				
				let minute = date.getMinutes();
				for (let i = minute; i <= 59; i++) {
					i = i < 10 ? '0' + i : i
					minuteArr.push(String(i))
				}
				// console.log(minuteArr)
				return minuteArr
			},
			getHourArray() {
				let hourArr = [];
				for (let i = 0; i <= 23; i++) {
					i = i < 10 ? '0' + i : i
					hourArr.push(String(i))
				}
				// console.log(hourArr)
				return hourArr
			},
			getMinuteArray() {
				let minuteArr = [];
				for (let i = 0; i <= 59; i++) {
					i = i < 10 ? '0' + i : i
					minuteArr.push(String(i))
				}
				// console.log(minuteArr)
				return minuteArr
			},
			getMap() {
				let that = this;
				uni.authorize({
					scope: 'scope.userLocation',
					success(res) {
						uni.chooseLocation({
							success: function(res) {
								console.log(res);
								console.log('位置名称：' + res.name);
								console.log('详细地址：' + res.address);
								console.log('纬度：' + res.latitude);
								console.log('经度：' + res.longitude);

								if (that.current == 0) {
									that.partyAddress = res.name;
									that.partyLatitude = res.latitude;
									that.partyLongitude = res.longitude;
								} else {
									that.meetingAddress = res.name;
									that.meetingLatitude = res.latitude;
									that.meetingLongitude = res.longitude;
								}

							}
						});
					},
					fail(err) {

					}
				})
			},
			tabsChange(type) {
				console.log(type);
				this.current = type;
			},
			swiperChange(e) {
				console.log(e);

				this.current = e.detail.current;
			},
			//动态获取高度
			initSwiperHeight(element) {

				uni.createSelectorQuery().in(this).select(element).boundingClientRect(result => {

					if (result && result.height > 0) {

						this.swiperHeight = result.height;

					} else {

						this.initSwiperHeight(element);
					}
				}).exec();

			},
			onConfirm() {
				console.log('关闭了');
				this.show = false;
			},
			onPartyTimePickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isPartyPickerShow = false;

				this.partyIndex = e.detail.value

			},
			onPartyTimePickerColumnChange: function(e) {
				console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
				
				if(e.detail.column == 0 && e.detail.value !== 0) {
					//第一个选项不为今天时重置第二、第三个选项
					this.partyArray[1] = this.getHourArray();
					this.partyArray[2] = this.getMinuteArray();
					
					this.partyIndex[1] = 0;
					this.partyIndex[2] = 0;
				} else if (e.detail.column == 0 && e.detail.value == 0) {
					//第一个选项为今天时重置第二、第三个选项
					this.partyArray[1] = this.getHourTodayArray();
					this.partyArray[2] = this.getMinuteTodayArray();
					
					this.partyIndex = [0,0,0];
				} else if (e.detail.column == 1 && e.detail.value !== 0) {
					//重置第第三个选项
					this.partyArray[2] = this.getMinuteArray();
					this.partyIndex[2] = 0;
				} else if (e.detail.column == 1 && e.detail.value == 0) {
					//重置第二、第三个选项
					this.partyArray[1] = this.getHourTodayArray();
					this.partyArray[2] = this.getMinuteTodayArray();
					
					this.partyIndex[1] = 0;
					this.partyIndex[2] = 0;
				}

				this.partyIndex[e.detail.column] = e.detail.value;

				// console.log(this.partyIndex);
				
				this.$forceUpdate();

			},
			onPartyAbortPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isPartyAbortPickerShow = false;

				this.abortIndex = e.detail.value

			},
			onPartyGenderPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isPartyGenderPickerShow = false;

				this.genderIndex = e.detail.value

			},
			onPartyAgePickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isPartyAgePickerShow = false;

				this.ageIndex = e.detail.value

			},
			onPartyAgePickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isPartyAgePickerShow = false;

				this.ageIndex = e.detail.value

			},
			onPartyPayPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isPartyPayPickerShow = false;

				this.payIndex = e.detail.value

			},
			onMeetingTypePickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isMeetingTypePickerShow = false;

				this.meetingTypeIndex = e.detail.value

			},
			onMeetingTimePickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isMeetingTimePickerShow = false;

				this.meetingTimeIndex = e.detail.value

			},
			onMeetingTimePickerColumnChange: function(e) {
				console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
				
				if(e.detail.column == 0 && e.detail.value !== 0) {
					//第一个选项不为今天时重置第二、第三个选项
					this.meetingTimeArray[1] = this.getHourArray();
					this.meetingTimeArray[2] = this.getMinuteArray();
					//重置索引
					this.meetingTimeIndex[1] = 0;
					this.meetingTimeIndex[2] = 0;
				} else if(e.detail.column == 0 && e.detail.value == 0) {
					//第一个选项为今天时重置第二、第三个选项
					this.meetingTimeArray[1] = this.getHourTodayArray();
					this.meetingTimeArray[2] = this.getMinuteTodayArray();
					//重置索引
					this.meetingTimeIndex = [0,0,0];
				} else if (e.detail.column == 1 && e.detail.value !== 0) {
					//重置第第三个选项
					this.meetingTimeArray[2] = this.getMinuteArray();
					this.meetingTimeIndex[2] = 0;
				} else if (e.detail.column == 1 && e.detail.value == 0) {
					//重置第二、第三个选项
					this.meetingTimeArray[1] = this.getHourTodayArray();
					this.meetingTimeArray[2] = this.getMinuteTodayArray();
					
					this.meetingTimeIndex[1] = 0;
					this.meetingTimeIndex[2] = 0;
				}

				this.meetingTimeIndex[e.detail.column] = e.detail.value;

				// console.log(this.meetingTimeIndex);
				
				this.$forceUpdate();
			},
			onMeetingAbortPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isMeetingAbortPickerShow = false;

				this.meetingAbortIndex = e.detail.value

				console.log("===========", this.abortIndex);

			},
			onMeetingGenderPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isMeetingGenderPickerShow = false;

				this.meetingGenderIndex = e.detail.value

				console.log("===========", this.abortIndex);

			},
			onMeetingAgePickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isMeetingAgePickerShow = false;

				this.meetingAgeIndex = e.detail.value

				console.log("===========", this.meetingAgeIndex);

			},
			onMeetingPayPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)

				this.isMeetingPayPickerShow = false;

				this.meetingPayIndex = e.detail.value

				console.log("===========", this.abortIndex);

			},
			onOverlimit(type) {
				// console.log(type);
				if (type == "minus") {

					uni.showToast({
						title: '已经是最少了',
						icon: 'none',
						duration: 2000
					});
				}
			},
			async getColumnSelect() {

				let res = await uni.$http.get(uni.$url.getColumnSelect);

				if (res.data.code == 401) {

					uni.navigateTo({
						url: '/pages/login/login'
					})

					return

				}

				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);

				let data = res.data.data;

				// console.log(data[0].child[0]['value']);

				this.partyTypeId = data[0].child[0]['value'];

				this.meetingTypeArray = data[1].child;

			},
			getInviteDate(index) {
				const temp = [];
				for (let i = 0; i < 7; i++) {

					if (i == index) {
						const time = new Date(new Date().setDate((new Date().getDate() + i)));
						const year = time.getFullYear();
						const month = `0${time.getMonth() + 1}`.slice(-2);
						const strDate = `0${time.getDate()}`.slice(-2);
						return `${year}-${month}-${strDate}`
					}
				}
			},
			isPartyDated() {
				let date = new Date(new Date().setDate((new Date().getDate())));
				//1.5小时后 时间戳
				let newDate = (new Date(date).getTime()) + (1.5*60*60)*1000;
				// 时间戳转时间
				date = new Date(newDate.valueOf());
				
				let hour = date.getHours();
				let minute = date.getMinutes();

				let hourIndex = this.partyArray[1].findIndex(item => item == hour);
				let minuteIndex = this.partyArray[2].findIndex(item => item == minute);

				if (this.partyIndex[0] == 0) {
					if (this.partyIndex[1] < hourIndex) {
						//大于当前时间弹出提示
						uni.showToast({
							title: '应邀时间应大于当前时间1.5小时',
							icon: 'none',
							duration: 2000
						});

						return false;

					} else if (this.partyIndex[1] == hourIndex) {
						if (this.partyIndex[2] < minuteIndex) {
							//大于当前时间弹出提示
							uni.showToast({
								title: '应邀时间应大于当前时间1.5小时',
								icon: 'none',
								duration: 2000
							});

							return false;
						}
					}
					return true;
				}

				return true;
			},
			isMeetingDated() {

				let date = new Date(new Date().setDate((new Date().getDate())));
				//1.5小时后 时间戳
				let newDate = (new Date(date).getTime()) + (1.5*60*60)*1000;
				// 时间戳转时间
				date = new Date(newDate.valueOf());

				let hour = date.getHours();
				let minute = date.getMinutes();

				let hourIndex = this.meetingTimeArray[1].findIndex(item => item == hour);
				let minuteIndex = this.meetingTimeArray[2].findIndex(item => item == minute);

				if (this.meetingTimeIndex[0] == 0) {
					if (this.meetingTimeIndex[1] < hourIndex) {
						//大于当前时间弹出提示
						uni.showToast({
							title: '应邀时间应大于当前时间1.5小时',
							icon: 'none',
							duration: 2000
						});

						return false;

					} else if (this.meetingTimeIndex[1] == hourIndex) {
						if (this.meetingTimeIndex[2] < minuteIndex) {
							//大于当前时间弹出提示
							uni.showToast({
								title: '应邀时间应大于当前时间1.5小时',
								icon: 'none',
								duration: 2000
							});

							return false;
						}
					}
					return true;
				}

				return true;
			},
			async addOrder() {


				let query = {};

				if (this.current == 0) {

					if (!this.partyTheme || this.partyTheme == '') return uni.showToast({
						title: '请输入邀约主题',
						icon: 'none',
						duration: 2000
					});

					if (this.isPartyPickerShow) return uni.showToast({
						title: '请选择应邀时间',
						icon: 'none',
						duration: 2000
					});

					let date = this.getInviteDate(this.partyIndex[0]);

					//判断是否超过当时时间
					let isDated = this.isPartyDated();

					if (!isDated) return uni.showToast({
						title: '应邀时间应大于当前时间1.5小时',
						icon: 'none',
						duration: 2000
					});

					let inviteDate = this.isPartyPickerShow == false ? date + " " + this.partyArray[1][this.partyIndex[
						1]] + ":" + this.partyArray[2][this.partyIndex[2]] : '';


					if (this.isPartyAbortPickerShow) return uni.showToast({
						title: '请选择截止应约时间',
						icon: 'none',
						duration: 2000
					});

					if (!this.partyAddress) return uni.showToast({
						title: '请选择地点',
						icon: 'none',
						duration: 2000
					});

					if (this.isPartyGenderPickerShow) return uni.showToast({
						title: '请选择应邀方性别',
						icon: 'none',
						duration: 2000
					});

					if (this.isPartyAgePickerShow) return uni.showToast({
						title: '请选择应邀方年龄',
						icon: 'none',
						duration: 2000
					});

					if (this.isPartyPayPickerShow) return uni.showToast({
						title: '请选择消费方式',
						icon: 'none',
						duration: 2000
					});

					if (this.payIndex == 0 && (!this.partyConsume || this.partyConsume == 0)) return uni.showToast({
						title: '请输入人均消费且不能为0',
						icon: 'none',
						duration: 2000
					});
					
					if(!this.partyInviteNum || this.partyInviteNum < 1) return uni.showToast({
						title: '应邀人数不能为空或小于1',
						icon: 'none',
						duration: 2000
					});
					
					if(!this.partyMinInviteNum || this.partyMinInviteNum < 1) return uni.showToast({
						title: '最低人数不能为空或小于1',
						icon: 'none',
						duration: 2000
					});
					
					if (this.partyInviteNum < this.partyMinInviteNum) return uni.showToast({
						title: '最低人数小于等于应邀人数应',
						icon: 'none',
						duration: 2000
					});

					query = {
					  "aaAverageAmount": this.partyConsume || 0,
					  "address": this.partyAddress,
					  "beInviteAge": this.ageArray[this.ageIndex].value,
					  "beInviteSex": this.genderArray[this.genderIndex].value,
					  "columnId": this.partyTypeId,
					  "consumerType": this.payArray[this.payIndex].value,
					  "inviteDate": inviteDate,
					  "inviteMinimum": this.partyMinInviteNum,
					  "inviteNum": this.partyInviteNum,
					  "inviteOverTimeSelect": this.abortArray[this.abortIndex].value,
					  "lat": this.partyLatitude,
					  "lon": this.partyLongitude,
					  "remark": "",
					  "title": this.partyTheme
					}

					// console.log(query);

				} else if (this.current == 1) {


					if (this.isMeetingTypePickerShow) return uni.showToast({
						title: '请选择类型',
						icon: 'none',
						duration: 2000
					});

					if (!this.meetingTheme || this.meetingTheme == '') return uni.showToast({
						title: '请输入邀约主题',
						icon: 'none',
						duration: 2000
					});

					if (this.isMeetingTimePickerShow) return uni.showToast({
						title: '请选择应邀时间',
						icon: 'none',
						duration: 2000
					});

					let date = this.getInviteDate(this.meetingTimeIndex[0]);

					//判断是否超过当时时间
					let isDated = this.isMeetingDated();

					if (!isDated) return uni.showToast({
						title: '应邀时间应大于当前时间1.5小时',
						icon: 'none',
						duration: 2000
					});

					let inviteDate = this.isMeetingTimePickerShow == false ? date + " " + this.meetingTimeArray[1][this
						.meetingTimeIndex[1]
					] + ":" + this.meetingTimeArray[2][this.meetingTimeIndex[2]] : '';


					if (this.isMeetingAbortPickerShow) return uni.showToast({
						title: '请选择截止应约时间',
						icon: 'none',
						duration: 2000
					});

					if (!this.meetingAddress) return uni.showToast({
						title: '请选择地点',
						icon: 'none',
						duration: 2000
					});

					if (this.isMeetingGenderPickerShow) return uni.showToast({
						title: '请选择应邀方性别',
						icon: 'none',
						duration: 2000
					});

					if (this.isMeetingAgePickerShow) return uni.showToast({
						title: '请选择应邀方年龄',
						icon: 'none',
						duration: 2000
					});

					if (this.isMeetingPayPickerShow) return uni.showToast({
						title: '请选择消费方式',
						icon: 'none',
						duration: 2000
					});

					if (this.meetingPayIndex == 0 && (!this.meetingConsume || this.meetingConsume == 0)) return uni.showToast({
						title: '请输入人均消费且不能为0',
						icon: 'none',
						duration: 2000
					});
					
					if(!this.meetingInviteNum || this.meetingInviteNum < 1) return uni.showToast({
						title: '应邀人数不能为空或小于1',
						icon: 'none',
						duration: 2000
					});
					
					if(!this.meetingMinInviteNum || this.meetingMinInviteNum < 1) return uni.showToast({
						title: '最低人数不能为空或小于1',
						icon: 'none',
						duration: 2000
					});
					
					if (this.meetingInviteNum < this.meetingMinInviteNum) return uni.showToast({
						title: '最低人数应小于等于应邀人数',
						icon: 'none',
						duration: 2000
					});
					
					query = {
					  "aaAverageAmount": this.meetingConsume || 0,
					  "address": this.meetingAddress,
					  "beInviteAge": this.meetingAgeArray[this.meetingAgeIndex].value,
					  "beInviteSex": this.meetingGenderArray[this.meetingGenderIndex].value,
					  "columnId": this.meetingTypeArray[this.meetingTypeIndex].value,
					  "consumerType": this.meetingPayArray[this.meetingPayIndex].value,
					  "inviteDate": inviteDate,
					  "inviteMinimum": this.meetingMinInviteNum,
					  "inviteNum": this.meetingInviteNum,
					  "inviteOverTimeSelect": this.meetingAbortArray[this.meetingAbortIndex].value,
					  "lat": this.meetingLatitude,
					  "lon": this.meetingLongitude,
					  "remark": this.remark,
					  "title": this.meetingTheme
					}
					

				}


				// 询问用户是否提交
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '请确认提交？'
				}).catch(err => err)

				if (err || !succ || !succ.confirm) return uni.$showMsg("取消提交");

				//防止短时间内重复提交
				if(!this.isDisable) return;
				
				this.isDisable = false;

				let res = await uni.$http.post(uni.$url.addOrder, query);
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

					this.isPersonalShow = true;

					uni.$showMsg(res.data.msg);

					return
				}


				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);

				uni.$showMsg(res.data.msg);
				
				this.columnId = res.data.data.columnId;
				
				this.orderSn = res.data.data.orderSn;

				this.isPayCashShow = true;

			},
			closePayCashModal() {
				this.isPayCashShow = false;
				
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #f1eff2;
	}
	
	.wrapper {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
		background: #f1eff2;
		overflow: auto;
	}
	
	.content {
		position: relative;
		padding-bottom: 130rpx;
		.bg_date {
			display: inline-block;
			position: absolute;
			top: 0;
			left: 0;
			width: 750rpx;
			height: 750rpx;
			z-index: 0;
		}
	}

	.left-wrap {
		display: flex;

		.navbar-left-text {
			color: #FFFFFF;
		}
	}

	.tabs-wrap {
		display: flex;
		position: relative;
		z-index: 100;
		.item-tabs {
			display: flex;
			width: 50%;
			font-size: 34rpx;
			justify-content: center;
			align-items: center;
			height: 130rpx;
			line-height: 130rpx;

			&.active {
				.icon-active {
					display: inline-block;
					font-weight: bold;
				}

				.icon-no-active {
					display: none;
				}

				.text {
					color: #37277B;
				}
			}

			.icon {
				display: inline-block;
				width: 54rpx;
				height: 54rpx;
				margin-right: 20rpx;
			}

			.icon-active {
				display: none;
			}

			.icon-no-active {
				display: inline-block;
				font-weight: bold;
				color: #666666;
				// -webkit-filter: grayscale(1); /* Webkit */  
				// filter: gray; /* IE6-9 */    
				// filter: grayscale(1); /* W3C */  
			}

			.text {}
		}

	}

	.tab-content {
		padding: 30rpx;
	}

	.inviting-info-wrap {
		padding: 30rpx;
		background: #FFFFFF;
		border-radius: 30rpx;

		.item-info {
			display: flex;
			// height: 80rpx;
			line-height: 80rpx;
			margin-bottom: 20rpx;
			border-radius: 10rpx;
			background: #F0F0F0;
			&.item-count {
				display: flex;
				justify-content: space-between;
				background: #FFFFFF;
				.label {
					display: inline-block;
					padding: 0 0 0 25rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: #010101;
				}
			}
			.icon-wrap {
				display: flex;
				width: 90rpx;
				height: 80rpx;
				flex-shrink: 0;
				justify-content: center;
				align-items: center;

				.icon {
					display: inline-block;
					width: 36rpx;
					height: 36rpx;
				}

				.icon-invite-theme {}

				.icon-invite-time {}

				.icon-invited-time {}

				.icon-invite-address {}

				.icon-invite-gender {}

				.icon-invite-pay {}
			}

			.input-text {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				&.input-consume {
					text-align: center;
				}
			}

			picker {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;

				.picker-placeholder {
					.input-text {
						color: #888888;
					}
				}

				.picker {
					width: 100%;
					height: 80rpx;
				}
			}

			.map-wrap {
				display: inline-block;
				width: 100%;

				.label {
					color: #888888;
				}
			}
		}

		.line {
			color: #AAAAAA;
		}

		.multi-column {
			.picker-placeholder {
				text-align: center;
			}

			.picker {
				text-align: center;
			}
		}
	}


	.minus {
		display: flex;
		width: 80rpx;
		height: 80rpx;
		justify-content: center;
		align-items: center;
		border: 2rpx dashed #B5B5B5;
		border-radius: 6rpx;
		// border: 1rpx dashed #DDDDDD;
	}

	.input {
		display: flex;
		position: relative;
		width: 200rpx;
		height: 80rpx;
		margin: 0 30rpx;
		color: #666666;
		background: #FFFFFF;
		border: 2rpx solid #B5B5B5;
		border-radius: 6rpx;
		font-weight: bold;
		justify-content: center;
		align-items: center;

		.input-text {
			display: inline-block;
			width: 100%;
			height: 100%;
			padding-left: 60rpx;
			text-align: left;
			font-size: 30rpx;
			font-weight: bold;
			color: #666666;
		}

		.text {
			display: inline-block;
			position: absolute;
			right: 15%;
			font-size: 30rpx;
			font-weight: 400;
			color: #AAAAAA;
		}
	}

	.plus {
		display: flex;
		width: 80rpx;
		height: 80rpx;
		justify-content: center;
		align-items: center;
		background: #FFFFFF;
		border: 2rpx dashed #B5B5B5;
		border-radius: 6rpx;
	}


	.publish-wrap {
		display: flex;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 130rpx;
		background: #F0F0F0;
		justify-content: center;
		align-items: center;

		.btn-publish {
			display: flex;
			width: 230rpx;
			height: 100rpx;
			padding: 0;
			margin: 0 auto 10rpx auto;
			background: #FFEA00;
			box-shadow: 0 8rpx 0 0 #FFAE00;
			border-radius: 50rpx;
			justify-content: center;
			align-items: center;
			font-size: 30rpx;
			// transition: 0.5s;
			z-index: 1000;
			box-shadow: 0 15rpx 15rpx 0 rgba(255, 174, 0, 0.5), 0 8rpx 0 0 #FFAE00;
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
				color: #FF3661;
				font-weight: bold;
			}
		}

	}
</style>
