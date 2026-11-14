import { z } from 'zod'

const emailRegex =
  /^[A-Za-z0-9_%+'-]+(?:\.[A-Za-z0-9_%+'-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/

export const emailField = z
  .string()
  .trim()
  .min(1, { message: 'Введите email' })
  .min(6, { message: 'Некорректный формат email' })
  .max(254, { message: 'Некорректный формат email' })
  .regex(emailRegex, { message: 'Некорректный формат email' })
  .refine(
    (value) => {
      const [localPart, domain] = value.split('@')

      if (!domain) {
        return false
      }

      const domainLabels = domain.split('.')

      return (
        localPart.length <= 64 &&
        !localPart.startsWith('-') &&
        !localPart.endsWith('-') &&
        domainLabels.every(
          (label) =>
            !label.startsWith('-') &&
            !label.endsWith('-') &&
            !label.toLowerCase().startsWith('xn--'),
        )
      )
    },
    { message: 'Некорректный формат email' },
  )

export const passwordField = z
  .string()
  .min(1, { message: 'Введите пароль' })
  .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
  .max(72, { message: 'Пароль не должен превышать 72 символа' })
  .refine((value) => value.trim().length > 0, {
    message: 'Пароль не может состоять только из пробелов',
  })
  .refine((value) => !/\p{Script=Cyrillic}/u.test(value), {
    message: 'Пароль не должен содержать кириллицу',
  })

export const nameField = z
  .string()
  .trim()
  .min(1, { message: 'Введите имя' })
  .min(2, { message: 'Имя должно содержать минимум 2 символа' })
  .max(100, { message: 'Имя не должно превышать 100 символов' })
  .regex(/^[A-Za-zА-Яа-яЁё]+(?:[ -][A-Za-zА-Яа-яЁё]+)*$/, {
    message: 'Имя может содержать только буквы, пробел и дефис',
  })
