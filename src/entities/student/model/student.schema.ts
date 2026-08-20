import { z } from 'zod'
import {
  STUDENT_AGE_MIN,
  STUDENT_CARDS_SHIFT_OPTIONS,
  STUDENT_LEVEL_OPTIONS,
  STUDENT_STATUS_OPTIONS,
  type TStudentCardsShift,
  type TStudentSortField,
} from '../config'

// Схема соответствует ответу бэкенда (см. postman_collection.json → students)
export const studentSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, { message: 'Введите имя' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Введите email' })
    .pipe(z.email({ message: 'Некорректный email' })),
  email_verified: z.boolean(),
  status: z.enum(STUDENT_STATUS_OPTIONS),
  age: z.number().int(),
  created_at: z.iso.datetime({ message: 'Некорректная дата создания' }),
  updated_at: z.iso.datetime({ message: 'Некорректная дата обновления' }),
  // Поля из доменной модели, которых пока нет в API, — опциональные
  level: z.enum(STUDENT_LEVEL_OPTIONS).optional(),
  cardsShift: z.enum(STUDENT_CARDS_SHIFT_OPTIONS).optional(),
  avatarSrc: z.url({ message: 'Некорректный URL аватара' }).optional(),
  lastLesson: z.iso.datetime({ message: 'Некорректная дата последнего занятия' }).optional(),
  // Поля реального API (добавлены бэкендом — см. postman_collection.json)
  last_lesson_at: z.string().nullable().optional(),
  avatar_media_id: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
})

// Ответ списка учеников: бэкенд отдаёт обёртку { items, total } (не массив!)
export const studentsListResponseSchema = z.object({
  items: z.array(studentSchema),
  total: z.number(),
})

export type TStudentsListResponse = z.infer<typeof studentsListResponseSchema>

export type TStudent = z.infer<typeof studentSchema>

export type TStudentCreateInput = Pick<TStudent, 'email' | 'name' | 'age' | 'status'>

export type TStudentFormValues = TStudentCreateInput & {
  avatarFile: File | null
  cardsShift?: TStudentCardsShift
}

export const studentFormDefaultValues: TStudentFormValues = {
  name: '',
  email: '',
  age: STUDENT_AGE_MIN,
  status: 'active',
  avatarFile: null,
  cardsShift: 'full',
}

// Параметры клиентской фильтрации/сортировки списка.
// Backend GET /students не принимает query-параметров — всё считается на клиенте.
export type TStudentsListParams = {
  sort?: TStudentSortField
  order?: 'asc' | 'desc'
  query?: string
  age?: number
}
