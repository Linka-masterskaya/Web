import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getStudents } from '../api/get-students'
import { studentQueryKeys } from '../lib/query-keys'

const STUDENTS_LIST_STALE_TIME_MS = 60_000

export const useStudents = () =>
  useQuery({
    queryKey: studentQueryKeys.list(),
    queryFn: getStudents,
    placeholderData: keepPreviousData,
    staleTime: STUDENTS_LIST_STALE_TIME_MS,
    gcTime: STUDENTS_LIST_STALE_TIME_MS * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
