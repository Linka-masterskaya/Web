import { useAuthStore } from '../model/auth-store'

export const consumeOAuthAccessToken = (): void => {
  const params = new URLSearchParams(window.location.hash.slice(1))
  const accessToken = params.get('access_token')

  if (!accessToken) {
    return
  }

  useAuthStore.getState().login(accessToken)
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
}
