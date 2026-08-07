import { createStore } from '@shared/lib/store'
import type { TAuthState, TAuthStore } from '../../types/types'

export const useAuthStore = createStore<TAuthStore, TAuthState>(
  // DevTools store name.
  'AuthStore',
  {
    // Storage key for persisted auth state.
    name: 'auth-store',
    // Persist the session between page reloads.
    partialize: (state) => ({ isAuth: state.isAuth, accessToken: state.accessToken }),
  },
)((set) => ({
  isAuth: false,
  accessToken: null,

  login: (accessToken) => set({ isAuth: true, accessToken }, false, 'auth/login'),

  logout: () => set({ isAuth: false, accessToken: null }, false, 'auth/logout'),
}))
