import { useAuthStore } from '@entities/auth/model/auth-store'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '../api'

export const useLogin = () => {
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.accessToken)
    },
  })
}
