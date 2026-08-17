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
}

export type TUserActions = {
  setUser: (user: TUserState) => void
  setAvatarSrc: (avatarSrc: TUserState['avatarSrc']) => void
  setName: (name: TUserState['name']) => void
  setEmail: (email: TUserState['email']) => void
}

export type TAuthStore = TAuthState & TAuthActions
export type TUserStore = TUserState & TUserActions
