import { foldersResponseSchema, type TFoldersResponse } from '../model/folder.schema'

const MOCK_FOLDERS: TFoldersResponse = [
  { id: 'my-sets', name: 'Мои наборы', parentId: null },
  { id: 'students', name: 'Картотека учеников', parentId: null },
  { id: 'student-1', name: 'Иванов Иван', parentId: 'students' },
  { id: 'student-2', name: 'Катюшина Екатерина', parentId: 'students' },
  { id: 'student-3', name: 'Сергиев Сергей', parentId: 'students' },
  { id: 'student-4', name: 'Зайчик Лиза', parentId: 'students' },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getFolders = async (): Promise<TFoldersResponse> => {
  await delay(300)

  return foldersResponseSchema.parse(MOCK_FOLDERS)
}
