// import Cookies from 'js-cookie'

// import { BASE_URL, WS_URL } from '@/shared'

/**
 * 获取cookie
 *
 * @param name
 * @returns
 */
export const getCookie = (name: string): string | undefined => localStorage.getItem(name) ?? undefined
// Cookies.get(name)

/**
 * 设置具有给定名称和值以及可选属性的 cookie。
 *
 * @param {string} name -cookie 的名称
 * @param {string} value -cookie的值
 * @param {Cookie.CookieAttributes}  cookie 的可选属性
 * @return {void}
 */

export const setCookie = (name: string, value: string) => {
	// Cookies.set(name, value, {
	// 	// 默认永久
	// 	expires: new Date('9999-12-31T23:59:59'),
	// 	...options
	// })
	localStorage.setItem(name, value)
}

/**
 * 删除cookie
 *
 * @param name
 * @returns
 */
export const removeCookie = (name: string) => localStorage.removeItem(name)

/**
 * 判断cookie是否存在
 *
 * @param name
 * @returns
 */
export const hasCookie = (name: string) => !!localStorage.getItem(name)

/**
 * 移除所有 cookie
 */
export const removeAllCookie = (filters: string[] = ['coss-request-storage']) => {
	// const keys = Object.keys(Cookies.get())
	// keys.forEach((key: string) => {
	// 	Cookies.remove(key)
	// })
	// localStorage.clear()

	// 获取所有的localStorage key
	const keys = Object.keys(localStorage)
	// 循环删除localStorage key
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]
		if (filters.includes(key)) continue
		localStorage.removeItem(key)
	}
}
