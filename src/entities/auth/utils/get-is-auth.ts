import { useAuthStore } from '../model/auth-store'

export const getIsAuth = () => {
  const { accessToken, isAuth } = useAuthStore.getState()

  return isAuth && Boolean(accessToken)
}
