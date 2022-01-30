<template>
	<view class="wrapper">
		<u-popup :show="isShow" :round="10" mode="center" @close="close" @open="open" closeOnClickOverlay :customStyle="{'width': '550rpx','height': '850rpx'}">
			<view class="personal-modal-wrap">
				<view class="userinfo">
					<!-- {{userinfo}} -->
					<image class="avatar" :src="userinfo.avatar"></image>
					<text class="username">{{userinfo.nickName}}</text>
				</view>
				<view class="item-info">
					<picker mode="selector" @change="onGendertPickerChange" :value="genderIndex" :range="genderArray" range-key="label">
						<view class="picker-placeholder" v-if="isGenderPickerShow">
							<view class="input-text">请选择性别</view>
						</view>
						<view class="picker" v-else>
							{{genderArray[genderIndex].label}}
						</view>
					</picker>
				</view>
				<view class="item-info">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="picker-placeholder" v-if="isDateShow">
							<view class="input-text">请选择出生日期</view>
						</view>
						<view class="picker" v-else>
							{{date}}
						</view>
					</picker>
				</view>
				<view class="item-info">
					<view class="picker-placeholder" v-if="!mobile">
						<button class="btn-phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号码</button>
					</view>
					<view class="picker" v-else>
						{{mobile}}
					</view>
				</view>
				<view class="tips-wrap">
					*手机号码、性别、年龄信息<br>
					一经修改不能编辑
				</view>
				<view class="handler-wrap">
					<view class="btn-submit" @click="onSubmit">确定提交</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	// 按需导入 mapMutations 辅助函数
	import { mapState, mapMutations } from 'vuex'
	export default {
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['userinfo','token']),
		},
		name:"personal",
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				mobile: null,
				date: currentDate,
				isDateShow: true,  //判断是否展示日期
				isGenderPickerShow: true,  //判断是否展示性别占位符
				genderIndex: 0, //索引
				genderArray: [{
					'label': '男',
					'value': 1
				},{
					'label': '女',
					'value': 2
				}],
				userinfo: this.$store.state.m_user.userinfo,
			};
		},
		props: {
			isShow: {
				type: Number,
				default: false
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		mounted() {

		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
			open() {
				// console.log('open');
			},
			close() {
				this.$emit('close');
			},
			async getPhoneNumber(e) {
				
				console.log(e)
				
				let that = this;
				
				uni.checkSession({
				  async success () {
					//session_key 未过期，并且在本生命周期一直有效
					console.log('成功')
					
					let query = {
						sessionKey: uni.getStorageSync('sessionKey'),
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
						// code: e.detail.code
					}
					
					let res = await uni.$http.get(uni.$url.getPhoneNumber, query);
					if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
					that.mobile = res.data.data.phoneNumber;
					
					uni.$showMsg(res.data.msg);
					
				  },
				  async fail () {
					// session_key 已经失效，需要重新执行登录流程
					console.log('失败')
					// uni.login() //重新登录
					
					// 调用微信登录接口
					const [err, res] = await uni.login().catch(err => err);
					
					// 判断是否 uni.login() 调用失败
					if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！');
					
					// 准备参数对象
					const query = {
						code: res.code,
					}
					// 换取 token
					const loginResult = await uni.$http.post(uni.$url.wxLoginUrl, query)
					
					if (loginResult.data.code !== 200) return uni.$showMsg('登录失败！')
					
					uni.showToast({
					 title: '登录成功',
					 icon: 'success'
					})
					
					uni.setStorageSync('sessionKey', loginResult.data.data.sessionKey);
					
					that.updateUserInfo(loginResult.data.data.user);
					
					that.updateToken('Bearer ' + loginResult.data.data.token);
					
					setTimeout(()=> {
						
						uni.showToast({
						 title: '请重新获取手机号码',
						 icon: 'none'
						})
						
					}, 2000)

				  }
				})
				
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 100;
				} else if (type === 'end') {
					// year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			bindDateChange(e) {
				
				this.date = e.target.value;
				
				this.isDateShow = false;
				
			},
			onGendertPickerChange(e) {
				
				this.genderIndex = e.detail.value;
				
				this.isGenderPickerShow = false;
			},
			async onSubmit() {
				
				if(this.isGenderPickerShow) return uni.showToast({title: '请选择性别',icon:'none',duration: 2000});
				if(this.isDateShow) return uni.showToast({title: '请选择性别',icon:'none',duration: 2000});
				if(!this.mobile || this.mobile == '') return uni.showToast({title: '请授权获取手机号',icon:'none',duration: 2000});
				if(!this.$store.state.m_user.userinfo.userId) return uni.showToast({title: '用户ID不存在，请重新登录！',icon:'none',duration: 2000});
				
				let query = {
					birthday: this.date,
					gender: this.genderArray[this.genderIndex].value,
					mobile: this.mobile,
					userId: this.$store.state.m_user.userinfo.userId
				}
				
				console.log(query);
				
				// 询问用户是否确认补全信息
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '只能填写一次，确认提交补全信息吗？'
				}).catch(err => err)
				
				if (err || !succ || !succ.confirm) return uni.$showMsg("取消提交");
				
				
				let res = await uni.$http.post(uni.$url.bindUserInfo, query);
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.$showMsg(res.data.msg);
				
				this.$emit('close');
				
				this.$emit('updateData');
				
			}
		}
	}
</script>

<style lang="scss">
	//完善个人信息弹出框
	.personal-modal-wrap {
		background: #FFFFFF;
		box-shadow: 0 20rpx 20rpx 0 rgba(0, 0, 0, 0.1);
		border-radius: 30rpx;
		.userinfo {
			text-align: center;
			padding: 55rpx 0 75rpx 0;
			.avatar {
				display: inline-block;
				width: 150rpx;
				height: 150rpx;
				margin-bottom: 50rpx;
				border-radius: 50%;
			}
			.username {
				display: block;
				font-size: 34rpx;
				font-weight: 400;
				color: #000000;
			}
		}
		.item-info {
			display: flex;
			height: 70rpx;
			line-height: 70rpx;
			margin: 0 50rpx 20rpx 50rpx;
			border-radius: 10rpx;
			background: #F0F0F0;
			border: 1rpx solid #AAAAAA;
			text-align: center;
			picker {
				width: 100%;
			}
			.input-text {
				height: 70rpx;
				line-height: 70rpx;
			}

			.picker-placeholder {
				width: 100%;
				.input-text {
					color: #888888;
				}
				.btn-phone {
					width: 100%;
					height: 70rpx;
					line-height: 70rpx;
					font-size: 34rpx;
					color: #888888;
					background: #F0F0F0;
					&::after {
						border: none;
					}
				}
			}
			.picker {
				width: 100%;
				height: 70rpx;
			}

		}
		.tips-wrap {
			margin: 110rpx auto 70rpx auto;
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
			line-height: 36rpx;
			text-align: center;
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
