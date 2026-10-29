import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { saveSetEditor } from '../lib/save-set-editor'

export const useSaveSetEditor = (setId: string) => {
  const queryClient = useQueryClient()
  return useCallback(() => saveSetEditor(setId, queryClient), [queryClient, setId])
}
