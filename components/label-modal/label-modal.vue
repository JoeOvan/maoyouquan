<template>
	<view class="wrapper">
		<u-popup :show="isShow" :round="10" mode="center" @close="close" @open="open" closeOnClickOverlay :customStyle="{'width': '550rpx','height': '850rpx'}">
			
			<view class="label-wrap">
				
				<view class="input-wrap">
					<input v-model="label" type="text" class="input-label" placeholder="输入个性标签" @confirm="confirmLabel">
					<button class="btn-confirm" @click="confirmLabel">使用</button>
				</view>
				
				<view class="label-show-wrap">
					<block v-for="(item,index) in labelData" :key="index">
						<view class="item-label">
							<image class="icon-close-label" src="../../static/icon-close-label.png" @click="deleteLabel(index)"></image>
							<text class="label">{{item}}</text>
						</view>
					</block>
				</view>
				
				<view class="label-tips">
					*最多能提交5个标签
				</view>
				
				<view class="handler-wrap">
					<view class="btn-submit" @click="updateLabel">确认提交</view>
				</view>
				
			</view>
			
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"label-modal",
		data() {
			return {
				label: '',
				labelData: []
			};
		},
		props: {
			isShow: {
				type: Number,
				default: false
			}
		},
		mounted() {
			
		},
		watch:{
			isShow(){
				if(this.isShow) return this.handleLabelList();
			}
		},
		methods: {
			open() {
				// console.log('open');
			},
			close() {
				
				this.$emit('close');
			},
			async handleLabelList() {

				// 发起请求
				const res = await uni.$http.get(uni.$url.getUserInfo)
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				let data = res.data.data;
				
				this.labelData = data.labelList;
			},
			confirmLabel() {
				
				if(this.labelData.length >= 5) return uni.$showMsg('最多只能提交5个标签');
				
				if(this.label.length <= 0) return uni.$showMsg('标签不能为空');
				
				if(this.label.length > 6) return uni.$showMsg('最多只能输入6个字符');
				
				if(this.labelData.findIndex(item => item === this.label) !== - 1) return uni.$showMsg('标签不能重复');
				
				// let item = {
				// 	'label': this.label,
				// 	'isShow': true
				// }
				
				this.labelData.push(this.label);
				
				this.label = '';
				
			},
			deleteLabel(indexLabel) {
				
				//删除对应标签
				this.labelData.splice(this.labelData.findIndex((item,index) => index === indexLabel), 1);
				
			},
			async updateLabel() {
				
				// 询问用户是否确认补全信息
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认提交标签信息吗？'
				}).catch(err => err)
				
				if (err || !succ || !succ.confirm) return uni.$showMsg("取消提交");
				
				// 发起请求
				const res = await uni.$http.post(uni.$url.updateLabel, { labelList: this.labelData })
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.$showMsg(res.data.msg);
				
				this.$emit('close');
				
				this.$emit('updateData');
				
			}
		}
	}
</script>

<style lang="scss">
	.label-wrap {
		padding: 50rpx;
		.input-wrap {
			display: flex;
			width: 450rpx;
			height: 70rpx;
			line-height: 70rpx;
			background: #FFFFFF;
			border: 1rpx solid #AAAAAA;
			border-radius: 10rpx;
		}
		.input-label {
			padding: 0 15rpx;
			height: 70rpx;
			line-height: 70rpx;
		}
		.btn-confirm {
			height: 70rpx;
			line-height: 70rpx;
			width: 120rpx;
			padding: 0 10rpx;
			background: #645DAF;
			border-radius: 0 10rpx 10rpx 0;
			font-size: 34rpx;
			font-weight: 400;
			color: #FFFFFF;
		}
		.label-show-wrap {
			display: flex;
			padding-top: 60rpx;
			height: 560rpx;
			justify-content: space-around;
			flex-wrap: wrap;
			.item-label {
				position: relative;
				display: inline-block;
				height: 70rpx;
				line-height: 70rpx;
				padding: 0 45rpx;
				margin-right: 40rpx;
				background: #E3E6F3;
				border: 1rpx solid #B3B8D9;
				border-radius: 10rpx;
				.icon-close-label {
					position: absolute;
					top: -20rpx;
					right: -20rpx;
					width: 40rpx;
					height: 40rpx;
				}
				.label {
					font-size: 34rpx;
					font-weight: 400;
					color: #37277B;
				}
			}
		}
		.label-tips {
			text-align: center;
			color: #999999;
			font-size: 24rpx;
			font-weight: 400;
		}
		.handler-wrap {
			.btn-submit {
				position: absolute;
				bottom: -125rpx;
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
	}
</style>
