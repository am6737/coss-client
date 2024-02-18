/** 错误状态码 */
export enum RESPONSE_CODE {
	/** 未认证 */
	Unauthorized = 401
}

/** 消息类型 */
export enum MESSAGE_TYPE {
	/** 文本 */
	TEXT = 1,
	/** 音频 */
	AUDIO = 2,
	/** 图片 */
	IMAGE = 3
}

/** 消息阅读状态 */
export enum MESSAGE_READ {
	/** 未读 */
	NOT_READ = 0,
	/** 已读 */
	READ = 1,
	/** 已删除 */
	DELETED = 2
}

/** 消息发送状态 */
export enum MESSAGE_SEND {
	/** 发送中 */
	SENDING = 0,
	/** 发送成功 */
	SEND_SUCCESS = 1,
	/** 发送失败 */
	SEND_FAILED = 2
}

/** 消息标记状态 */
export enum MESSAGE_MARK {
	/** 未标记 */
	NOT_MARK = 0,
	/** 已标记 */
	MARK = 1
}

/** 提示类型 */
export enum TOOLTIP_TYPE {
	COPY = 'copy',
	FORWARD = 'forward',
	EDIT = 'edit',
	DELETE = 'delete',
	SELECT = 'select',
	REPLY = 'reply',
	MARK = 'mark'
}

/** 平台 */
export enum PLATFORM {
	/** web */
	WEB = 'web',
	/** ios */
	IOS = 'ios',
	/** android */
	ANDROID = 'android'
}

/** 申请列表类型 */
export enum ApplyType {
	/** 好友 */
	FRIEND = 0,
	/** 群聊 */
	GROUP = 1
}

/** 申请列表状态管理 */
export enum ApplyStatus {
	/** 申请中 */
	PENDING = 0,
	/** 已同意 */
	ACCEPT = 1,
	/** 已拒绝 */
	REFUSE = 2,
	/** 邀请发送者 */
	INVITE_SENDER = 3,
	/** 被邀请者 */
	INVITE_RECEIVER = 4
}

/** 群聊管理列表状态管理 */
// export enum ApplyGroupStatus {
// 	/** 申请中 */
// 	PENDING = 0,
// 	/** 已同意 */
// 	ACCEPT = 1,
// 	/** 已拒绝 */
// 	REFUSE = 2,
// 	/** 邀请发送者 */
// 	INVITE_SENDER = 3,
// 	/** 被邀请者 */
// 	INVITE_RECEIVER = 4
// }