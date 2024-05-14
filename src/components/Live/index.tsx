import CallService from '@/api/call'
import { useLiveStore } from '@/stores/live'
import { Icon, Popup } from 'framework7-react'
import { LocalTrackPublication, Room, VideoPresets } from 'livekit-client'
import { useEffect, useRef, useState } from 'react'
import OperateButton from './OperateButton'

/* 测试 */
const LiveRoom: React.FC = () => {
	/** 通话状态 */
	const liveStore = useLiveStore()

	/** 客户端 */
	const client = useRef<Room>()

	/** 视频 */
	const [localVideoTrack, setLocalVideoTrack] = useState<LocalTrackPublication | null>()

	/** 音频 */
	const [localAudioTrack, setLocalAudioTrack] = useState<LocalTrackPublication | null>()

	/** 检查权限 */
	const checkPermission = async (
		option = {
			audio: true,
			video: true
		}
	) => {
		try {
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('不支持媒体设备')
			// 检查
			const stream = await navigator.mediaDevices.getUserMedia(option)
			// 释放
			stream.getTracks().forEach((track: any) => track.stop())
		} catch (error) {
			console.error(error)
		}
	}

	/**
	 * 开关本地视频流
	 */
	const toggleVideoTrack = async () => {
		if (!client.current) return
		if (localVideoTrack) {
			client.current.localParticipant.setCameraEnabled(false) // 禁用视频
			setLocalVideoTrack(null)
		} else {
			setLocalVideoTrack(await client.current.localParticipant.setCameraEnabled(true)) // 启用视频
			if (!localVideoTrack) return
			const parentElement = document.querySelector('.live-room') // local-video-container
			//播放本地视频
			const element = (localVideoTrack as LocalTrackPublication)?.track?.attach()
			console.log(element)
			element && parentElement?.appendChild(element)
		}
	}

	/**
	 * 开关本地音频流
	 */
	const toggleAudioTrack = async () => {
		if (!client.current) return
		if (localAudioTrack) {
			client.current.localParticipant.setMicrophoneEnabled(false) // 禁用音频
			setLocalAudioTrack(null)
		} else {
			setLocalAudioTrack(await client.current.localParticipant.setMicrophoneEnabled(true)) // 启用音频
		}
	}

	/** 初始化客户端 */
	const initClient = async () => {
		await checkPermission({
			audio: true,
			video: true
		})
		client.current = new Room({
			adaptiveStream: true,
			dynacast: true,
			videoCaptureDefaults: {
				// resolution: VideoPresets.h90.resolution
				resolution: VideoPresets.h720.resolution
			}
		})
		console.log(client.current)
	}

	/** 连接房间 */
	const connectRoom = async (url: string, token: string) => {
		try {
			!client.current && (await initClient())
			await client.current?.connect(url, token).then(() => {
				console.log('已连接房间', client.current)
				toggleAudioTrack()
				liveStore.isVideo && toggleVideoTrack()
			})
		} catch (error) {
			console.error('连接房间失败', error)
		}
	}

	/** 检查用户与好友是否有通话 */
	const checkCalling = async () => {
		liveStore.updateHideRoom(true)
		liveStore.updateCalling(false)
		const { code, data } = await CallService.getLiveInfoUserApi()
		console.log('检查通话', data)
		if (code === 200 && data) {
			initClient()
			liveStore.updateHideRoom(false)
			return
		}
	}

	/** 初始化 */
	useEffect(() => {
		checkCalling()
	}, [])

	/** 连接 */
	useEffect(() => {
		console.log(liveStore.calling, liveStore.url, liveStore.token)
		if (liveStore.calling) {
			connectRoom(liveStore.url, liveStore.token)
		}
	}, [liveStore.calling, liveStore.url, liveStore.token])

	return (
		<>
			<Popup
				opened={!liveStore.hideRoom}
				tabletFullscreen
				closeByBackdropClick={false}
				className="live-room bg-bgPrimary text-textPrimary"
			>
				<div className="flex">
					{liveStore.isVideo && (
						<OperateButton
							f7Icon={localVideoTrack ? 'videocam_fill' : 'videocam'}
							text="摄像头"
							onClick={() => toggleVideoTrack()}
						/>
					)}
					<OperateButton
						f7Icon={localAudioTrack ? 'mic_fill' : 'mic'}
						text="麦克风"
						onClick={() => toggleAudioTrack()}
					/>
					<OperateButton
						f7Icon="phone_fill"
						text="接通"
						iconColor="#fff"
						backgroundColor="#43d143"
						onClick={liveStore.joinRoom}
					/>
					<OperateButton
						f7Icon="phone_fill"
						text="拒绝"
						iconRotate={134}
						iconColor="#fff"
						backgroundColor="#ff4949"
						onClick={() => liveStore.rejectRoom()}
					/>
					<OperateButton
						f7Icon="phone_fill"
						text="挂断"
						iconRotate={134}
						iconColor="#fff"
						backgroundColor="#ff4949"
						onClick={() => liveStore.leaveRoom()}
					/>
				</div>
			</Popup>
			{liveStore.hideRoom && liveStore.calling && (
				<div
					className="size-10 rounded-l-lg bg-black text-white opacity-50 transition-opacity-[0.3s] flex justify-center items-center fixed top-1/3 right-0 z-[99999]"
					onClick={() => liveStore.updateHideRoom(false)}
				>
					<Icon f7="phone_fill" size={20} />
				</div>
			)}
		</>
	)
}

export default LiveRoom
