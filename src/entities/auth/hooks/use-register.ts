import { useMutation } from '@tanstack/react-query'
import { registerApi } from '../api'

export const useRegister = () =>
  useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: registerApi,
  })
