import type { TEditUserProfilePasswordFormValues } from '@entities/user'

export type TEditPasswordResponse = {
  success: boolean
  message: string
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const requestEditPassword = async (
  values: TEditUserProfilePasswordFormValues,
): Promise<TEditPasswordResponse> => {
  await delay(2000)

  console.log('Edit password form values:', values)

  return {
    success: true,
    message: 'Пароль изменен',
  }
}
