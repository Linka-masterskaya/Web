import type { TForgotPasswordFormValues } from '../model'

export type TForgotPasswordResponse = {
  success: boolean
  message: string
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const requestForgotPassword = async (
  values: TForgotPasswordFormValues,
): Promise<TForgotPasswordResponse> => {
  await delay(2000)

  console.log('Forgot password form values:', values)

  return {
    success: true,
    message: 'Инструкция по восстановлению пароля отправлена на почту',
  }
}
