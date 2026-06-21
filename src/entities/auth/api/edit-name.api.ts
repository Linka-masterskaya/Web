import type { TChangeUserNameFormValues } from '@entities/user'

export type TEditNameResponse = {
  success: boolean
  name: string
  message: string
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const requestEditName = async (
  values: TChangeUserNameFormValues,
): Promise<TEditNameResponse> => {
  await delay(2000)

  console.log('Edit name form values:', values)

  return {
    success: true,
    name: values.name,
    message: 'Имя изменено',
  }
}
