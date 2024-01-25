import $ from 'dom7'
import React, { useRef, useState, useEffect } from 'react'
import PropType from 'prop-types'
import { useLiveQuery } from 'dexie-react-hooks'
import { f7, Navbar, Link, Page, Messages, Message, Messagebar, MessagebarSheet, Icon } from 'framework7-react'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import Emojis from '@/components/Emojis/Emojis.jsx'
import './Messages.less'
import { useUserStore } from '@/stores/user'
// import { userService } from '@/db'
import _ from 'lodash-es'
import { sendToUser } from '@/api/msg'
import { getUserInfoApi } from '@/api/user'

// import { pgpDecrypt, pgpEncrypt } from '@/utils/utils'
// import { switchE2EKeyApi } from '@/api/relation'
// import WebSocketClient from '@/utils/WebSocketClient'
// import { toArrayBuffer, encrypt, decrypt, reconnectSession } from '@/utils/signal/signal-protocol'
// import { SessionCipher, SignalProtocolAddress } from '@privacyresearch/libsignal-protocol-typescript'
// import { SignalProtocolStore } from '@/utils/signal/storage-type'
// import { reconnectSession } from '@/utils/signal/signal-protocol'
// import { encryptMessage, decryptMessage, importKey } from '@/utils/signal/signal-crypto'
// import { getSession } from '@/utils/session'
// import MessageBox from '@/components/Message/Msg'
import { encryptMessage, decryptMessage, cretateNonce } from '@/utils/tweetnacl'
import userService from '@/db'

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired
}

export default function MessagesPage({ f7route }) {
	// 会话信息
	const dialogId = f7route.query.dialog_id
	// 用户信息
	const { user } = useUserStore()

	// 会话 session
	// const [sessionCipher, setSessionCipher] = useState()
	// const [slefSessionCipher, setSessionSlefCipher] = useState()

	// 好友id/群聊id
	const ReceiverId = f7route.params.id
	// 好友信息
	const [contact, setContact] = useState({})
	// 消息
	const allMsg = useLiveQuery(() => userService.findAll(userService.TABLES.USERS)) || []
	const [messages, setMessages] = useState([])

	const [isActive, setIsActive] = useState(true)
	const [isSend, setIsSend] = useState(false)
	// const [userInfo, setUserInfo] = useState({})
	// const [userSesion, setUserSession] = useState({})
	const [preKey, setPreKey] = useState(null)

	// const [height, setHeight] = useState('100vh')

	const [nonce] = useState(cretateNonce())

	useEffect(() => {
		// 基本初始化
		const init = async () => {
			// let userInfo = null,
			// 	userSession = null,
			// 	preKey = null

			try {
				const reslut = await userService.findOneById(userService.TABLES.USERS, ReceiverId)
				// userInfo = await userService.findOneById(userService.TABLES.USERS, user?.user_id)
				if (!reslut) return

				console.log('reslut', reslut)
				setPreKey(reslut?.data?.shareKey)
				// userSession = await getSession(user?.user_id, ReceiverId)
				// console.log('userSession', userSession)
				// if (!userSession) return
				// 预共享密钥
				// preKey = await importKey(userSession?.preKey)
			} finally {
				// setUserInfo(userInfo)
				// setUserSession(userSession)
				// setPreKey(preKey || '1')
			}

			// 设置户消息
			// let userContact = await userService.findOneById(userService.TABLES.CONTACTS, ReceiverId)
			// if (!userContact) {
			// 	const res = await getUserInfoApi({ user_id: ReceiverId })
			// 	console.log('查询用户信息', res)
			// }
			// setContact(userContact)

			// // 触顶加载
			// const messagesContent = document.getElementsByClassName('page-content messages-content')[0]
			// // 滚动到顶部加载更多
			// messagesContent?.addEventListener(
			// 	'scroll',
			// 	_.throttle(async () => {
			// 		if (messagesContent.scrollTop === 0) {
			// 			console.log('触顶')
			// 		}
			// 	}, 1000)
			// )

			// return () => {
			// 	messagesContent?.removeEventListener('scroll', () => {})
			// }
		}
		init()
	}, [])

	useEffect(() => {
		// 首次进来初始化消息列表,把解密的消息放入到这里
		const initMsgs = async () => {
			try {
				if (!preKey) return
				// 只截取最新的 30 条消息，从后面往前截取
				const msgs = allMsg?.find((item) => item.user_id === ReceiverId)?.data?.msgs?.slice(-30) || []
				for (let i = 0; i < msgs.length; i++) {
					const msg = msgs[i]
					let content = msg.content
					try {
						const msg = JSON.parse(content)
						content = decryptMessage(msg.msg, msg.nonce, preKey)
						console.log('解密消息', content, msg)
					} catch {
						content = '该消息解密失败'
					}
					msg.content = content
				}
				setMessages(msgs)
				setTimeout(() => setIsActive(false), 1000)
			} catch (error) {
				console.error('error', error)
			}
		}

		const updateMsg = async () => {
			try {
				const lastMsg = allMsg?.find((item) => item.user_id === ReceiverId)?.data?.msgs?.at(-1) || []

				// 如果是发送消息
				if (isSend) {
					const msg = messages.at(-1)
					msg.send_state = lastMsg?.send_state
					setIsSend(false)
					setMessages(messages)
					return
				}

				// 如果是接收消息
				let content = lastMsg?.content
				try {
					const msg = JSON.parse(content)
					content = decryptMessage(msg.msg, msg.nonce, preKey)
				} catch {
					// console.log('解密失败：', error)
					content = lastMsg?.content
					// const session = await updateSession(user?.user_id, ReceiverId)
					// const preKey = await importKey(session?.preKey)
					// setPreKey(preKey || '1')
				}
				lastMsg.content = content
				console.log('lastMsg', lastMsg, messages)
				setMessages([...messages, lastMsg])
			} catch (error) {
				console.error('解析消息失败：', error.message)
			}
		}

		const initContact = async () => {
			if (contact) return
			const user = await userService.findOneById(userService.TABLES.CONTACTS, ReceiverId)
			// console.log('contact', user)
			// if (!user) {
			// 	const res = await getUserInfoApi({ user_id: ReceiverId })
			// 	console.log('查询用户信息', res)
			// }
			setContact(user)
		}

		if (isActive) {
			initContact()
			initMsgs()
			return
		}
		updateMsg()
	}, [preKey, allMsg])

	// 联系人头像信息等
	// useEffect(() => {
	// 	if (!ReceiverId) return
	// 	;(async () => {
	// 		const contact = await WebDB.contacts.where('user_id').equals(ReceiverId).first()

	// 		console.log('contact', contact)
	// 		setContact(contact || {})
	// 	})()
	// }, [ReceiverId])

	useEffect(() => {
		;(async () => {
			try {
				// console.log('ReceiverId', ReceiverId, user?.user_id)
				// // 重连会话
				// const cipher = await reconnectSession(ReceiverId, user?.user_id)
				// setSessionCipher(cipher)
				// // const selfCipher = await reconnectSession(ReceiverId, user?.user_id, true)
				// // setSessionSlefCipher(selfCipher)

				// if (isActive) setIsActive(false)
				if (contact) return
				const user = await userService.findOneById(userService.TABLES.CONTACTS, ReceiverId)
				console.log('contact', user)
				if (!user) {
					const res = await getUserInfoApi({ user_id: ReceiverId })
					console.log('查询用户信息', res)
				}
				setContact(user)

				const messagesContent = document.getElementsByClassName('page-content messages-content')[0]
				// 滚动到顶部加载更多
				messagesContent?.addEventListener(
					'scroll',
					_.throttle(async () => {
						if (messagesContent.scrollTop === 0) {
							console.log('触顶')
						}
					}, 1000)
				)

				return () => {
					messagesContent?.removeEventListener('scroll', () => {})
				}
			} catch (error) {
				console.log('消息初始化失败', error)
			}
		})()
	}, [])

	// 消息渲染处理
	const messageTime = (message) => {
		return message?.created_at
			? Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(message.created_at))
			: ''
	}
	const isMessageFirst = (message) => {
		const messageIndex = messages.indexOf(message)
		const previousMessage = messages[messageIndex - 1]
		return !previousMessage || previousMessage.type !== message.type
	}
	const isMessageLast = (message) => {
		const messageIndex = messages.indexOf(message)
		const nextMessage = messages[messageIndex + 1]
		return !nextMessage || nextMessage.type !== message.type
	}
	const messageType = (message) => {
		return message.receiver_id === ReceiverId ? 'sent' : 'received'
	}

	// 发送消息
	const messagebarRef = useRef(null)
	const [messageText, setMessageText] = useState('')
	const dbMsgToReqMsg = (obj) => {
		return {
			..._.mapKeys(_.pick(obj, ['content', 'receiver_id', 'content_type']), (value, key) => {
				if (key === 'content_type') return 'type'
				return key
			}),
			dialog_id: parseInt(dialogId)
		}
	}

	const sendMessage = async (type, content) => {
		try {
			if (isActive) setIsActive(false)
			let encrypted = ''
			try {
				// encrypted = await encrypt(content, sessionCipher)
				// encrypted = JSON.stringify(encrypted)
				encrypted = encryptMessage(content, nonce, preKey)
				console.log('发送加密消息', encrypted)
			} catch (error) {
				console.log('发送加密消息失败', error)
				encrypted = content
			}
			const msg = { msg: encrypted, nonce }

			encrypted = JSON.stringify(msg)

			// const fe = decryptMessage(encrypted, nonce, preKey)
			// console.log('加密消息', encrypted, fe)

			let send_state = 'sending'
			const dbMsg = {
				sender_id: user.user_id,
				receiver_id: ReceiverId,
				// 发送方
				type: 'sent',
				content: encrypted,
				// 1: 文本, 2: 语音, 3: 图片
				content_type: type,
				date: new Date(),
				send_state,
				is_read: true
			}
			setIsSend(true)
			// 先假设发送是 ok 的
			setMessages([...messages, { ...dbMsg, content, send_state: 'ok' }])

			// 发送消息接口
			try {
				const { code } = await sendToUser(dbMsgToReqMsg(dbMsg))
				dbMsg.send_state = code === 200 ? 'ok' : 'error'
			} catch (error) {
				console.error('发送失败', error)
				dbMsg.send_state = 'error'
			}

			// 查找本地消息记录
			const result = await userService.findOneById(userService.TABLES.USERS, ReceiverId)
			// result
			// 	?
			await userService.update(userService.TABLES.USERS, ReceiverId, {
				user_id: ReceiverId,
				// data: [...result.data, { ...dbMsg, content: encrypted }]
				data: { ...result.data, msgs: [...result.data.msgs, { ...dbMsg, content: encrypted }] }
			})
			// : await userService.add(userService.TABLES.USERS, {
			// 		user_id: ReceiverId,
			// 		// data: [{ ...dbMsg, content: encrypted }]
			// 		data: {  }
			// 	})
		} catch (error) {
			console.error('发送消息失败：', error)
			// throw error
		}
	}

	const sendTextMessage = async () => {
		sendMessage(1, messageText)
		// 恢复输入框状态
		setMessageText('')
		setTimeout(() => {
			messagebarRef.current.f7Messagebar().focus()
		})
	}

	// 图片表情
	const [sheetVisible, setSheetVisible] = useState(false)
	const onEmojiSelect = ({ type, emoji }) => {
		console.log(type, emoji)
		type === 'emoji' && setMessageText(`${messageText}${emoji}`)
		type === 'img' && sendMessage(3, emoji)
	}

	// Fix for iOS web app scroll body when
	const resizeTimeout = useRef(null)
	const onViewportResize = () => {
		// setHeight(visualViewport.height - 88 + 'px')
		$('html, body').css('height', `${visualViewport.height}px`)
		$('html, body').scrollTop(0)
	}
	const onMessagebarFocus = () => {
		const { device } = f7
		if (!device.ios || device.cordova || device.capacitor) return
		clearTimeout(resizeTimeout.current)
		visualViewport.addEventListener('resize', onViewportResize)
	}
	const onMessagebarBlur = () => {
		const { device } = f7
		if (!device.ios || device.cordova || device.capacitor) return
		resizeTimeout.current = setTimeout(() => {
			visualViewport.removeEventListener('resize', onViewportResize)
			$('html, body').css('height', '')
			$('html, body').scrollTop(0)
		}, 100)
	}

	return (
		<Page className="messages-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink backLinkShowText={false}>
				<Link slot="right" iconF7="videocam" />
				<Link slot="right" iconF7="phone" />
				<Link slot="title" href={`/profile/${ReceiverId}/`} className="title-profile-link">
					<img src={contact?.avatar} loading="lazy" />
					<div>
						<div>{contact?.name}</div>
						<div className="subtitle">online</div>
					</div>
				</Link>
			</Navbar>
			<Messagebar
				ref={messagebarRef}
				placeholder=""
				value={messageText}
				sheetVisible={sheetVisible}
				onInput={(e) => setMessageText(e.target.value)}
				onFocus={onMessagebarFocus}
				onBlur={onMessagebarBlur}
			>
				<Link slot="inner-start" iconF7="plus" />
				<Link
					className="messagebar-sticker-link"
					slot="after-area"
					iconF7="smiley"
					onClick={() => {
						setSheetVisible(!sheetVisible)
					}}
				/>
				{messageText.trim().length ? (
					<Link
						slot="inner-end"
						className="messagebar-send-link"
						iconF7="paperplane_fill"
						onClick={sendTextMessage}
					/>
				) : (
					<>
						<Link slot="inner-end" href="/camera/" iconF7="camera" />
						<Link slot="inner-end" iconF7="mic" />
					</>
				)}
				{/* 表情、图片选择 */}
				<MessagebarSheet>
					<Emojis onEmojiSelect={onEmojiSelect} />
				</MessagebarSheet>
			</Messagebar>

			{/* <MessageBox messages={messages} height={height} /> */}

			<Messages>
				{messages.map((message, index) => (
					<Message
						key={index}
						className="message-appear-from-bottom"
						data-key={index}
						first={isMessageFirst(message)}
						last={isMessageLast(message)}
						tail={isMessageLast(message)}
						image={message.content_type === 3 ? [message.content] : ''}
						type={messageType(message)}
						text={message.content_type === 3 ? '' : message.content}
					>
						<span slot="text-footer">
							{messageTime(message)}
							{message?.send_state && message.type === 'sent' ? (
								message.send_state === 'ok' ? (
									<DoubleTickIcon />
								) : (
									<Icon
										className="text-base"
										f7={message.send_state === 'sending' ? 'slowmo' : 'wifi_slash'}
										color="primary"
									/>
								)
							) : (
								''
							)}
						</span>
					</Message>
				))}
			</Messages>
		</Page>
	)
}
