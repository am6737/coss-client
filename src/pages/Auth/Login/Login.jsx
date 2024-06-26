import React, { useState } from 'react'
import { f7, ListInput, List, LoginScreenTitle, Button, theme, Preloader, Link } from 'framework7-react'
import { $t } from '@/i18n'
import { useUserStore } from '@/stores/user'
import { At, Lock } from 'framework7-icons/react'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { loginApi } from '@/api/user'
import { validEmail } from '@/utils/validate'
import '../Auth.less'
import { clsx } from 'clsx'
import Qrcode from '@/components/QRCode/QRCode'

// import Signal, { toBase64 } from '@/utils/signal/signal-protocol'
import commonService from '@/db/common'

/**
 * 验证用户是否在新设备上登录
 * @param {*} data
 */
async function validDeviceInfo(data) {
	try {
		const users = await commonService.findAll(commonService.TABLES.HISTORY)
		const user = users.find((item) => item.data.account === data.email)
		if (!user) return true
		return false
	} catch (error) {
		console.error('验证用户是否在新设备上登录失败', error)
		return false
	}
}

export default function Login({ disabled, defaultData }) {
	// 表单数据
	const [fromData, setFromData] = useState({ email: '', password: '' })

	// 错误提示
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')

	// 登录loading
	const [loading, setLoading] = useState(false)

	// 用户信息
	const userStore = useUserStore()

	// 弹窗
	const [opened, setOpened] = useState(false)

	// 错误信息列表
	const errorList = {
		emailEmpty: $t('邮箱不能为空'),
		emailFormat: $t('邮箱格式不正确'),
		passwordEmpty: $t('密码不能为空'),
		errorMessage: $t('登录失败，请稍后重试！'),
		serverError: $t('服务器错误，请稍后重试！'),
		deviceError: $t('该设备为新设备，请扫码登录或者输入唯一密码！请等待开发人员新增验证功能！')
	}

	// todo： 这里确认自己的名字和设备id
	// const deviceName = Math.random().toString(36).slice(-8)
	// const deviceId = Math.floor(10000 * Math.random())
	// const [signal] = useState(new Signal(deviceName, deviceId))

	useEffect(() => {
		if (defaultData) {
			setTimeout(() => setFromData({ email: defaultData.email, password: defaultData.password }), 10)
		}
	}, [defaultData])

	const close = () => setOpened(false)

	// 登录
	const signIn = async () => {
		try {
			// 判断是否正在登录
			if (loading) return

			// 初步校验
			if (!fromData.email.trim()) return setEmailError(errorList.emailEmpty)
			if (!validEmail(fromData.email.trim())) return setEmailError(errorList.emailFormat)
			if (!fromData.password.trim()) return setPasswordError(errorList.passwordEmpty)

			// 判断是否是新设备
			// const valid = await validDeviceInfo(fromData)
			// if (valid) return setOpened(true)
			// f7.dialog.alert(errorList.deviceError)

			// loading
			setLoading(true)
			// 登录
			let decryptedData = await loginApi({ ...fromData, driver_id: '11' })

			// 无论登录成功与否都需要关闭 loading
			if (decryptedData) setLoading(false)

			if (decryptedData.code !== 200) return f7.dialog.alert(decryptedData.msg || errorList.errorMessage)
			if (decryptedData.data.token) userStore.updateToken(decryptedData.data.token)
			if (decryptedData.data.user_info) await userStore.updateUser(decryptedData.data.user_info)

			const id = decryptedData.data.user_info?.user_id

			const user = await commonService.findOneById(commonService.TABLES.HISTORY, id)
			if (user) {
				await commonService.update(commonService.TABLES.HISTORY, id, {
					data: { ...user.data, lastLoginTime: Date.now() }
				})
			}

			// 生成信令
			// const info = await signal.ceeateIdentity(signal.deviceName)

			// const directory = signal.directory?.getPreKeyBundle(signal.deviceName) || {}
			// const obj = {
			// 	...directory,
			// 	deviceName: signal.deviceName,
			// 	deviceId: signal.deviceId
			// }
			// const data = JSON.stringify(toBase64(obj))

			// 更新信令
			// userStore.updateIdentity({ ...info })
			// userStore.updateSignal(signal)
			// userStore.updateDirectory(data)
			userStore.updateLogin(true)

			setLoading(false)

			window.location.href = '/'
		} catch (err) {
			console.log(err.message)
			f7.dialog.alert(err.message || errorList.serverError)
			setLoading(false)
		}
	}

	// 返回时需要操作
	useEffect(() => {
		if (disabled) {
			setFromData({ email: '', password: '' })
			setEmailError('')
			setPasswordError('')
			setLoading(false)
		}
	}, [disabled])

	return (
		<>
			<LoginScreenTitle>{$t('登录')}</LoginScreenTitle>
			<List form>
				<ListInput
					label={$t('邮箱')}
					type="text"
					placeholder={$t('请输入邮箱')}
					className="el-input"
					outline
					value={fromData.email}
					onInput={(e) => {
						setFromData({ ...fromData, email: e.target.value })
						setEmailError('')
					}}
					floatingLabel
					errorMessage={emailError}
					errorMessageForce={!!emailError}
				>
					<At slot="media" className={clsx('w-5 h-5 text-icon-60', theme.ios && 'mt-1')} />
				</ListInput>
				<ListInput
					label={$t('密码')}
					type="password"
					placeholder={$t('请输入密码')}
					value={fromData.password}
					onInput={(e) => {
						setFromData({ ...fromData, password: e.target.value })
						setPasswordError('')
					}}
					outline
					floatingLabel
					errorMessage={passwordError}
					errorMessageForce={!!passwordError}
				>
					<Lock slot="media" className={clsx('w-5 h-5 text-icon-60', theme.ios && 'mt-1')} />
				</ListInput>

				<p className="mx-[18px] mt-[6px] flex justify-end">
					<Link href="#" className="text-sm text-blue-500">
						验证码登录
					</Link>
					{/* <Link href="#" className="text-sm text-blue-500">
						忘记密码
					</Link> */}
				</p>
			</List>
			<List inset>
				<Button onClick={signIn} large className="mx-[16px] mb-5" fill round text={$t('登录')}>
					{loading && <Preloader size="16" color="white" className="" />}
				</Button>
			</List>
			<Qrcode title="扫码验证" opened={opened} close={close} />
		</>
	)
}

Login.propTypes = {
	disabled: PropTypes.bool.isRequired,
	defaultData: PropTypes.object
}
