import { useAuthStore } from '../model/auth-store'

export const getIsAuth = () => useAuthStore.getState().isAuth
