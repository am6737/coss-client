import { getPublicKeyApi } from '@/api/user'
import { dbService } from '@/db'
import commonService from '@/db/common'
// import { performKeyExchange, exportKey, importPublicKey } from '@/utils/signal/signal-crypto'
import { importKey,performKeyExchange } from '@/utils/tweetnacl'

export async function getSession(user_id, friend_id) {
	try {
		const userSession = await dbService.findOneById(dbService.TABLES.USERS, friend_id)
		const userInfo = await commonService.findOneById(commonService.TABLES.HISTORY, user_id)

		console.log("userSession",userSession,userInfo);

		if (!userSession) {
			// 获取公钥
			const res = await getPublicKeyApi({ user_id: friend_id })
			if(res.code !== 200) return null

			const json = JSON.parse(res?.data?.secret_bundle)

			const publicKey = importKey(json.publicKey)
			
			const sharedKey = performKeyExchange(userInfo?.data?.keyPair?.privateKey, publicKey)
			console.log(sharedKey);
			await dbService.add(dbService.TABLES.USERS, {
				user_id: friend_id,
				data: {
					publicKey: publicKey,
					shareKey: sharedKey,
					msgs:[]
				}
			})

			return sharedKey
		} else {
			return userSession.data?.shareKey
		}
	} catch (error) {
		console.error('获取 Session 失败', error)
		return null
	}
}

export async function updateSession(user_id, friend_id) {
	try {
		const data = await getPublicKey(user_id, friend_id)
		await dbService.update(dbService.TABLES.SESSION, { user_id, data })
		return data
	} catch (error) {
		console.error('更新 Session 失败', error)
		return null
	}
}

async function getPublicKey(user_id, friend_id) {
	const res = await getPublicKeyApi({ user_id })

	if (res.code !== 200) throw new Error(res.msg)

	// 查找用户的密钥
	const user = await dbService.findOneById(dbService.TABLES.USERS, friend_id)

	const result = JSON.parse(res.data?.secret_bundle || '{}')

	const publicKey = await importPublicKey(result?.publicKey)

	const preKey = await performKeyExchange(user?.data?.keyPair, publicKey)

	const data = {
		...result,
		preKey: await exportKey(preKey)
	}

	return data
}
