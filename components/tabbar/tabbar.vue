<template>
	<u-tabbar
		:value="current"
		:fixed="true"
		:placeholder="false"
		activeColor="#d81e06"
		:safeAreaInsetBottom="false"
	>
		<u-tabbar-item text="首页" @click="toPage(0)">
			<image
				class="u-page__item__slot-icon"
				slot="active-icon"
				src="https://cdn.uviewui.com/uview/common/bell-selected.png"
			></image>
			<image
				class="u-page__item__slot-icon"
				slot="inactive-icon"
				src="https://cdn.uviewui.com/uview/common/bell.png"
			></image>
		</u-tabbar-item>
		<u-tabbar-item text="放映厅" icon="photo" @click="toPage(1)"></u-tabbar-item>
	</u-tabbar>
</template>

<script>
	export default {
		name:"tabbar",
		props: {
			current: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				value4: 1,
			};
		},
		methods: {
			toPage(type) {
				if(type == 0) {
					uni.navigateTo({
						url: '/pages/index/index'
					})
				} else if (type == 1) {
					uni.navigateTo({
						url: '/pages/mine/mine'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.u-page__item__slot-icon {
		display: inline-block;
		width: 50rpx;
		height: 50rpx;
	}
</style>
