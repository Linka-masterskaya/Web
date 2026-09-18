import { useAuthStore } from '@entities/auth'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getUserProfile } from '../api/user-profile'
import { userQueryKeys } from '../lib/query-keys'
import { useUserStore } from '../model/user-store'

const USER_PROFILE_STALE_TIME_MS = 5 * 60_000

export const useUserProfile = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const setUser = useUserStore((state) => state.setUser)

  const query = useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: getUserProfile,
    staleTime: USER_PROFILE_STALE_TIME_MS,
    enabled: Boolean(accessToken),
  })

  useEffect(() => {
    if (!query.data) {
      return
    }

    setUser({
      name: query.data.name,
      email: query.data.email,
      avatarSrc: query.data.avatarUrl,
      role: query.data.role,
    })
  }, [query.data, setUser])

  return query
}
