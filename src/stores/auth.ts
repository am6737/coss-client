// import { logoutApi } from '@/api/user'
import { logoutApi } from '@/api/user'
import { createPersistStore } from '@/lib/store'

interface UserState {
    userId: string
    token: string
    userInfo: any
    driverId: string
}

const initialState: UserState = {
    userId: '',
    token: '',
    userInfo: {},
    driverId: ''
}

export const useAuthStore = createPersistStore(
    initialState,
    (set, get) => ({
        async logout(driverId: string): Promise<ResponseData> {
            return new Promise((resolve, reject) => {
                logoutApi({ driver_id: driverId })
                    .then((res) => {
                        set(initialState)
                        localStorage.removeItem('COSS_USER_STORE') // 清理localStorage
                        resolve(res)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },
        clear: () => {
            set(initialState)
            localStorage.removeItem('COSS_USER_STORE') // 清理localStorage
        }
    }),
    {
        name: 'COSS_USER_STORE',
        version: 1
        // migrate(state, version) {
        // return newState as any
        // }
    },

)