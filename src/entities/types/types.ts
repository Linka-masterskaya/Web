import type { TUserRole } from '../user/config/user-role'

export type TAuthState = {
  isAuth: boolean
  accessToken: string | null
}

export type TAuthActions = {
  login: (accessToken: string) => void
  setAccessToken: (accessToken: string) => void
  logout: () => void
}

export type TUserState = {
  name: string | null
  email: string | null
  avatarSrc: string | null
  role: TUserRole | null
}

export type TUserActions = {
  setUser: (user: Partial<TUserState>) => void
  setAvatarSrc: (avatarSrc: TUserState['avatarSrc']) => void
  setName: (name: TUserState['name']) => void
  setEmail: (email: TUserState['email']) => void
  resetUser: () => void
}

export type TAuthStore = TAuthState & TAuthActions
export type TUserStore = TUserState & TUserActions
