// раздел, содержимое которого запрашивается у бэка
export type TSection = 'library' | 'my' | 'students'

// поле сортировки содержимого папки
export type TSectionContentSort = 'name' | 'updated_at'

// направление сортировки
export type TSectionContentOrder = 'asc' | 'desc'

// тип папки в ответе бэка
// folder - обычная папка
// student - папка ученика в картотеке
export type TFolderKind = 'folder' | 'student'

// общие поля папки и набора
type TSectionContentItemBase = {
  id: string
  name: string
  updated_at: string
}

// элеммент ответа с type='folder'
export type TFolderContentItem = TSectionContentItemBase & {
  type: 'folder'
  kind?: TFolderKind | null
  student_id?: string | null
}

// элемент ответа с type='pack'
export type TPackContentItem = TSectionContentItemBase & {
  type: 'pack'
  published?: boolean
}

// элемент в items
export type TSectionContentItem = TFolderContentItem | TPackContentItem

// ответ GET /section/{section}/contents
export type TSectionContentResponse = {
  items: TSectionContentItem[]
  limit: number
  offset: number
}

// параметры функции получения содержимого раздела или папки
export type TGetSectionContentParams = {
  section: TSection
  parentId?: string // не передается в корень раздела, при открытии папки содержит id этой папки
  sort?: TSectionContentSort
  order?: TSectionContentOrder
  limit?: number
  offset?: number
  signal?: AbortSignal // позволяет отменить устаревший запрос
}
