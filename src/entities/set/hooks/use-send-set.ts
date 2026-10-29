import { useMutation } from '@tanstack/react-query'
import { sendSet } from '../api/send-set'

export const useSendSet = () => {
  return useMutation({
    mutationFn: sendSet,
  })
}
