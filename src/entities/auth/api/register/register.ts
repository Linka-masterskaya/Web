import type { TRegisterFormValues } from '@entities/auth/model/register-form.schema'
import { createDemoAccessToken } from '../../lib/create-demo-access-token'

type TRegisterResponse = {
  accessToken: string
}

export const registerApi = async (_values: TRegisterFormValues): Promise<TRegisterResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { accessToken: createDemoAccessToken() }
}
