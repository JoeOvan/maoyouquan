// let BASE_URL = 'http://192.168.0.115/dev-api';
let BASE_URL = 'https://myq.winzkj.com/prod-api';
// let BASE_URL = 'http://3f0b717183.wicp.vip/dev-api';

let API_URL = {
	baseUrl: BASE_URL,
	//直播列表

	//登录
	wxLoginUrl: BASE_URL + "/api/wxLogin/login",
	//登出
	wxLogoutUrl: BASE_URL + "/api/wxLogin/logout",
	//查询栏目 包含二级栏目
	getColumnSelect: BASE_URL + "/api/column/getColumnSelect",
	//查询二级栏目下拉框
	getColumnTwoLevelSelect: BASE_URL + "/api/column/getColumnTwoLevelSelect",
	//查询首页二级栏目下拉框
	getIndexColumnTwoLevelSelect: BASE_URL + "/api/column/getIndexColumnTwoLevelSelect",
	//查看首页工单列表
	getIndexOrderList: BASE_URL + "/api/order/getIndexOrderList",
	//新增邀约工单
	addOrder: BASE_URL + "/api/order/addOrder",
	//授权获取手机号码
	getPhoneNumber: BASE_URL + "/api/wxLogin/phone",
	//绑定用户信息
	bindUserInfo: BASE_URL + "/api/myInfo/bindUserInfo",
	//获取发布邀约列表
	getMyInviteOrderList: BASE_URL + "/api/myInfo/getMyInviteOrderList",
	//查看首页工单详情
	getIndexOrderInfoById: BASE_URL + "/api/order/getIndexOrderInfoById",
	//查看我的工单详情
	getMyOrderInfoById: BASE_URL + "/api/order/getMyOrderInfoById",
	//查看我的工单详情
	payWxInvite: BASE_URL + "/api/pay/wx/invite",
	//查看首页我发布的进行中工单列表
	getIndexMyOrderList: BASE_URL + "/api/order/getIndexMyOrderList",
	//工单应邀
	beInvited: BASE_URL + "/api/order/beInvited",
	//支付邀约单金额
	payWxMargin: BASE_URL + "/api/pay/wx/margin",
	//工取消邀约工单
	cancelInvite: BASE_URL + "/api/order",
	//工取消邀约工单
	getUserInfo: BASE_URL + "/api/myInfo/getUserInfo",
	//获取我应邀的所有邀约工单列表
	getMyBeInviteOrderList: BASE_URL + "/api/myInfo/getMyBeInviteOrderList",
	//更新标签
	updateLabel: BASE_URL + "/api/myInfo/updateLabel",
	//获取保证金金额
	getMargin: BASE_URL + "/api/pay/wx/getMargin",
	//更新订单用户状态
	updateOrderUserState: BASE_URL + "/api/order/updateOrderUserState",
	//获取用户保证金数目
	getCashMargin: BASE_URL + "/api/myInfo/getMargin",
	//获取用户保证金数目
	getCash: BASE_URL + "/api/pay/wx/withdraw",
	//获取交友卡信息
	getUserFriendCardInfo: BASE_URL + "/api/order/getUserFriendCardInfo",
	//邀约消息订阅授权成功
	inviteAuthSuccess: BASE_URL + "/api/subscribe/inviteAuthSuccess",
	//应邀消息订阅授权成功
	beInviteAuthSuccess: BASE_URL + "/api/subscribe/beInviteAuthSuccess",
	//应邀消息订阅授权成功
	getInviteCash: BASE_URL + "/api/pay/wx/getInvite",
	//选择工单用户
	chooseOrderUser: BASE_URL + "/api/order/chooseOrderUser",
	//上传反馈图片
	uploadFeedbackImg: BASE_URL + "/api/feedback/uploadFeedbackImg",
	//上传反馈图片
	getEvaluation: BASE_URL + "/api/feedback/getEvaluation",
	//应邀者 => 邀约者反馈
	beInviteFeedback: BASE_URL + "/api/feedback/beInviteFeedback",
	//邀约者 => 应邀者反馈
	inviteFeedback: BASE_URL + "/api/feedback/inviteFeedback",
	
	
	
};

export {
	API_URL
};
