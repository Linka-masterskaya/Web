import type { TLoginFormValues } from '@entities/auth/model/login-form.schema'
import { createDemoAccessToken } from '../../lib/create-demo-access-token'

type TLoginResponse = {
  accessToken: string
}

export const loginApi = async (_values: TLoginFormValues): Promise<TLoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { accessToken: createDemoAccessToken() }
}
