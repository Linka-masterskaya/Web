import { createStore } from '@shared/lib/store'
import type { TAuthState, TAuthStore } from '../../types/types'
import { getRandomDemoToken } from '../api/get-auth-token'

export const useAuthStore = createStore<TAuthStore, Pick<TAuthState, 'isAuth'>>(
  // DevTools store name.
  'AuthStore',
  {
    // Storage key for persisted auth state.
    name: 'auth-store',
    // Persist only the auth flag.
    partialize: (state) => ({ isAuth: state.isAuth }),
  },
)((set) => ({
  isAuth: false,
  accessToken: null,

  login: async () => {
    const token = await getRandomDemoToken()
    set({ isAuth: true, accessToken: token }, false, 'auth/login')
  },

  refreshAccessToken: async () => {
    const token = await getRandomDemoToken()
    set({ accessToken: token }, false, 'auth/refresh-token')
  },

  logout: () => set({ isAuth: false, accessToken: null }, false, 'auth/logout'),
}))
