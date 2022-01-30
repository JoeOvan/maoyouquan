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
		
		<view class="order-refund-info">
			<view class="order-refund-title">
				反馈问题
			</view>
			
			<view class="order-feedback">
				
				<block v-for="(item,index) in feedbackData" :key="index">
					<view :class="{'item-label': true, 'item-label-checked': item.checked}">
						<text class="label" @click="radioClick(item.name)">{{item.name}}</text>
					</view>
				</block>
				
			</view>
			
			<view class="order-refund-title">
				补充描述和凭证
			</view>
			<view class="order-refund-text">
				<view class="order-refund-inp">
					<textarea v-model="msgText" class="order-refund-textarea" maxlength="100" placeholder="补充描述,有助于客服更好的处理反馈问题" />
					<view style="text-align: right;">{{msgText && msgText.length || 0}}/100</view>
				</view>
				<view class="order-refund-img">
					<view class="order-refund-up">
						<image src="../../static/icon-upload.png" @click="uploadImg" mode=""></image>
					</view>
					<view class="order-refund-imgList">
						<view v-for="(item,index) in imgArr" :key="index" style="position: relative;">
							<image src="../../static/icon-delete-image.png" class="order-refund-del"  @click="delImg(index)"></image>
							<image :src="item.url">
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="handler-wrap">
			<view class="btn-submit" @click="feedback">确定提交</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				feedbackData: [],
				msgText: '',
				imgArr:[],
				orderUserId: '',  //订单id
				feedbackType: 0,	//0应邀 1邀约
				problem: '',  //反馈问题
			}
		},
		onLoad(options) {
			
			this.orderUserId = options.orderUserId;
			this.feedbackType = options.feedbackType;
			
			console.log(this.orderUserId)
			
			this.getEvaluation();
		},
		methods: {
			leftClick() {
			
				uni.navigateBack({
					delta: 1
				})
			
			},
			radioClick(name) {
				this.feedbackData.map((item, index) => {
					item.checked = item.name === name ? true : false
				})
			},
			async getEvaluation() {
				
				let res = await uni.$http.get(uni.$url.getEvaluation);
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				let data = res.data.data;
				
				let itemObj = [];
				data.forEach((item,index) => {
					
					itemObj[index] = {};
					itemObj[index]['name'] = item;
					itemObj[index]['checked'] = false;
					
				});
				
				this.feedbackData = itemObj;

			},
			uploadImg(){
				let that = this
				uni.chooseImage({
					success: (res) => {
						
						if(res.tempFiles.length > 4 || res.tempFiles.length + that.imgArr.length > 4) return uni.$showMsg("已超出4张图片",2000);
						
						const tempFilePaths = res.tempFilePaths;
						
						for(let i = 0;i < tempFilePaths.length; i++) {
							uni.uploadFile({
								url: uni.$url.uploadFeedbackImg, //仅为示例，非真实的接口地址
								filePath: tempFilePaths[i],
								name: 'file',
								header: {
									'Authorization': this.$store.state.m_user.token,
								},
								success: (uploadFileRes) => {
									
									let arr = JSON.parse(uploadFileRes.data)
									that.imgArr.push(arr.data);
								}
							});
						}
					}
				})
				
			},
			async feedback() {
				
				let problemObj = this.feedbackData.find(item => item.checked == true);
				
				if(!problemObj) return uni.$showMsg('请选择要反馈的问题');
				
				let imgList = [];
				this.imgArr.forEach((item)=> {
					
					imgList.push(item.url);
					
				})
				
				console.log(imgList);
				
				let query = {
				  "comment": this.msgText,
				  "imgList": imgList,
				  "orderUserId": this.orderUserId,
				  "problem": problemObj.name
				}
				
				// 询问用户是否提交
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '请确认提交反馈？'
				}).catch(err => err)
				
				if (err || !succ || !succ.confirm) return uni.$showMsg("取消提交");
				
				let url = '';
				//0应邀 1邀约
				if(this.feedbackType == 0) {
					url = uni.$url.beInviteFeedback;
				} else {
					url = uni.$url.inviteFeedback;
				}
				
				let res = await uni.$http.post(url, query);
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.navigateBack({
					delta: 1
				})

			}
		}
	}
</script>

<style lang="scss">
	
	page {
		background: #f0f0f0;
	}
	
	.wrapper {

	}
	
	.left-wrap {
		display: flex;
		.navbar-left-text {
			color: #FFFFFF;
		}
	}
	
	.order-refund-info {
		width: 710rpx;
		margin: 20rpx;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 20px;
		box-sizing: border-box;
		.order-refund-title{
			font-weight: bold;
			color: #000000;
			font-size: 30rpx;
		}
		
		.order-feedback {
			padding: 30rpx 0;
			.item-label {
				display: inline-block;
				height: 50rpx;
				line-height: 50rpx;
				padding: 0 20rpx;
				margin: 0 30rpx 30rpx 0;
				background: #FFFFFF;
				border: 1rpx solid #CCCCCC;
				border-radius: 10rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #333333;
				&.item-label-checked {
					background: #E3E6F3;
					border: 1rpx solid #B3B8D9;
					color: #37277B;
				}
			}
		}
		
		.order-refund-text{
			background-color: #F6F6F6;
			border-radius: 10rpx;
			padding: 20rpx;
			margin: 25rpx 0 0rpx 0;
			.order-refund-textarea{
				font-size: 24rpx;
				font-weight: 400;
				color: #010101;
				width: 607rpx;
				height: 100rpx;
				margin-bottom: 20rpx;
			}
			.order-refund-img{
				display: flex;
				flex-direction:row;
				margin-top: 22rpx;
				image{
					margin-right: 20rpx;
					width: 100rpx;
					height: 100rpx;
				}
				.order-refund-up{
					margin-right: 20rpx;
					width: 100rpx;
					height: 100rpx;
				}
				.order-refund-imgList{
					display: flex;
					flex-direction:row;
					.order-refund-del{
						position: absolute;
						top:-10rpx;
						right: -10rpx;
						width: 28rpx;
						height: 28rpx;
						z-index: 999;
					}
				}
				
			}
		}
		
	}
	
	.handler-wrap {
		position: absolute;
		width: 100%;
		bottom: 128rpx;
		.btn-submit {
			width: 300rpx;
			height: 80rpx;
			line-height: 80rpx;
			margin: 0 auto;
			background: #FFFFFF;
			border: 1rpx solid #CCCCCC;
			border-radius: 40rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #000000;
			text-align: center;
		}
	}
	
</style>
