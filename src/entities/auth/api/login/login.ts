import type { TLoginFormValues } from '@entities/auth/model/login-form.schema'
import {
  type TTokenResponse,
  tokenResponseSchema,
} from '@entities/auth/model/token-response.schema'
import { apiClient } from '@shared/lib/api'

export const loginApi = (values: TLoginFormValues): Promise<TTokenResponse> =>
  apiClient.post('auth/login', { json: values }).json(tokenResponseSchema)
