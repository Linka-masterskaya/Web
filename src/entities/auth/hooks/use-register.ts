import { useAuthStore } from '@entities/auth/model/auth-store'
import { useMutation } from '@tanstack/react-query'
import { registerApi } from '../api'

export const useRegister = () => {
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: registerApi,
    onSuccess: (data) => {
      login(data.accessToken)
    },
  })
}
