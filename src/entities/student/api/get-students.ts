import { studentSchema, type TStudent } from '../model/student.schema'

const MOCK_STUDENTS: TStudent[] = [
  {
    id: 'student-1',
    name: 'Иванов Иван',
    email: 'ivan@example.com',
    age: 5,
    level: 'easy',
    state: 'active',
    lastLesson: '2026-05-12T14:30:00Z',
  },
  {
    id: 'student-2',
    name: 'Катюшина Екатерина',
    email: 'ekaterina@example.com',
    age: 7,
    level: 'medium',
    state: 'paused',
    lastLesson: '2025-12-30T10:00:00Z',
    avatarSrc: 'https://i.ibb.co/5gZ10ZC4/ekaterina-student.jpg',
  },
  {
    id: 'student-3',
    name: 'Сергиев Сергей',
    email: 'sergey@example.com',
    age: 9,
    level: 'hard',
    state: 'archived',
    lastLesson: '2026-05-12T16:00:00Z',
  },
  {
    id: 'student-4',
    name: 'Зайчик Лиза',
    email: 'liza@example.com',
    age: 10,
    level: 'easy',
    state: 'single',
    lastLesson: '2024-12-01T09:00:00Z',
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getStudents = async (): Promise<TStudent[]> => {
  console.log('[API] getStudents — запрос списка учеников')
  await delay(300)
  return MOCK_STUDENTS.map((s) => studentSchema.parse(s))
}
