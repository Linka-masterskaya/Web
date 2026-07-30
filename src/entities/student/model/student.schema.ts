import { z } from 'zod'
import {
  STUDENT_AGE_MAX,
  STUDENT_AGE_MIN,
  STUDENT_CARDS_SHIFT_OPTIONS,
  STUDENT_STATE_OPTIONS,
} from '../config'

export const studentSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, { message: 'Введите имя' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Введите email' })
    .pipe(z.email({ message: 'Некорректный email' })),
  age: z
    .number()
    .int()
    .min(STUDENT_AGE_MIN, { message: `Возраст от ${STUDENT_AGE_MIN} лет` })
    .max(STUDENT_AGE_MAX, { message: `Возраст до ${STUDENT_AGE_MAX} лет` }),
  state: z.enum(STUDENT_STATE_OPTIONS),
  cardsShift: z.enum(STUDENT_CARDS_SHIFT_OPTIONS),
  avatarSrc: z.url({ message: 'Некорректный URL аватара' }).optional(),
  lastLesson: z.iso.datetime({ message: 'Некорректная дата последнего занятия' }).optional(),
})

export const studentListSchema = z.array(studentSchema)

export type TStudent = z.infer<typeof studentSchema>

export type TStudentFormValues = Pick<
  TStudent,
  'name' | 'email' | 'age' | 'state' | 'cardsShift'
> & {
  avatarFile: File | null
}

export const studentFormDefaultValues: TStudentFormValues = {
  name: '',
  email: '',
  age: STUDENT_AGE_MIN,
  state: 'active',
  avatarFile: null,
  cardsShift: 'full',
}
