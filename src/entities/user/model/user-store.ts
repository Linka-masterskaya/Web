import { createStore } from '@shared/lib/store'
import type { TUserState, TUserStore } from '../../types/types'

const initialState: TUserState = {
  name: null,
  email: null,
  avatarSrc: null,
}

export const useUserStore = createStore<TUserStore>('UserStore')((set) => ({
  ...initialState,

  setUser: (user) => {
    set(user)
  },

  setAvatarSrc: (avatarSrc) => {
    set({ avatarSrc })
  },

  setName: (name) => {
    set({ name })
  },

  setEmail: (email) => {
    set({ email })
  },
}))
