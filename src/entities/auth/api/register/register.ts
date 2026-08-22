import type { TRegisterFormValues } from '@entities/auth/model/register-form.schema'
import { apiClient } from '@shared/lib/api'

type TRegisterRequest = Pick<TRegisterFormValues, 'name' | 'email' | 'password'>

const toRegisterRequest = ({ name, email, password }: TRegisterFormValues): TRegisterRequest => ({
  name,
  email,
  password,
})

export const registerApi = async (values: TRegisterFormValues): Promise<void> => {
  await apiClient.post('auth/register', { json: toRegisterRequest(values) })
}
