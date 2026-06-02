export type TAuthState = {
  isAuth: boolean
  accessToken: string | null
}

export type TAuthActions = {
  login: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  logout: () => void
}

export type TAuthStore = TAuthState & TAuthActions
