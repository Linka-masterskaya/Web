import { z } from 'zod'
import {
  STUDENT_AGE_MAX,
  STUDENT_AGE_MIN,
  STUDENT_CARDS_SHIFT_OPTIONS,
  STUDENT_STATUS_OPTIONS,
  type TStudentCardsShift,
  type TStudentSortField,
  type TStudentStatus,
} from '../config'

/** Ответ API Student (OpenAPI components.schemas.Student) */
export const studentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, { message: 'Введите имя' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Введите email' })
    .pipe(z.email({ message: 'Некорректный email' })),
  email_verified: z.boolean(),
  status: z.enum(STUDENT_STATUS_OPTIONS),
  age: z.number().int().min(0).max(100).nullable(),
  cards_shift: z.enum(STUDENT_CARDS_SHIFT_OPTIONS),
  last_lesson_at: z.string().nullable().optional(),
  avatar_media_id: z.string().uuid().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  created_at: z.iso.datetime({ message: 'Некорректная дата создания' }),
  updated_at: z.iso.datetime({ message: 'Некорректная дата обновления' }),
})

export const studentsListResponseSchema = z.object({
  items: z.array(studentSchema),
  total: z.number().int().nonnegative(),
})

export type TStudentsListResponse = z.infer<typeof studentsListResponseSchema>
export type TStudent = z.infer<typeof studentSchema>

/** POST /students */
export type TStudentCreateInput = {
  email: string
  name: string
  age?: number | null
  status?: TStudentStatus
  cards_shift?: TStudentCardsShift
  avatar_media_id?: string | null
}

/** PATCH /students/{id} */
export type TStudentUpdateInput = {
  email?: string
  name?: string
  age?: number | null
  status?: TStudentStatus
  last_lesson_at?: string | null
  cards_shift?: TStudentCardsShift | null
  avatar_media_id?: string | null
}

/** Поля формы ученика (UI); cardsShift мапится в cards_shift при отправке */
export type TStudentFormValues = {
  name: string
  email: string
  age: number
  status: TStudentStatus
  cardsShift: TStudentCardsShift
  avatarFile: File | null
}

export const studentFormFieldsSchema = z.object({
  name: z.string().trim().min(1, { message: 'Введите имя' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Введите email' })
    .pipe(z.email({ message: 'Некорректный email' })),
  age: z.number().int().min(STUDENT_AGE_MIN).max(STUDENT_AGE_MAX),
  status: z.enum(STUDENT_STATUS_OPTIONS),
  cardsShift: z.enum(STUDENT_CARDS_SHIFT_OPTIONS),
})

export const studentFormDefaultValues: TStudentFormValues = {
  name: '',
  email: '',
  age: STUDENT_AGE_MIN,
  status: 'active',
  avatarFile: null,
  cardsShift: 'full',
}

/**
 * Параметры клиентской фильтрации/сортировки списка.
 * GET /students принимает limit/offset/sort_by/order — пока список грузится целиком
 * и фильтруется на клиенте.
 */
export type TStudentsListParams = {
  sort?: TStudentSortField
  order?: 'asc' | 'desc'
  query?: string
  age?: number
}
