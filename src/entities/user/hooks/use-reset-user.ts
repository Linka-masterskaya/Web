import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { userQueryKeys } from '../lib/query-keys'
import { useUserStore } from '../model/user-store'

export const useResetUser = () => {
  const queryClient = useQueryClient()
  const resetUser = useUserStore((state) => state.resetUser)

  return useCallback(() => {
    resetUser()
    queryClient.removeQueries({ queryKey: userQueryKeys.all })
  }, [queryClient, resetUser])
}
