// раздел, содержимое которого запрашивается у бэка
export type TSection = 'library' | 'my' | 'students'

// поле сортировки содержимого папки
export type TSectionContentSort = 'name' | 'updated_at'

// направление сортировки
export type TSectionContentOrder = 'asc' | 'desc'

export type TSectionContentItem = {
  type: 'folder' | 'pack'
  id: string
  name: string
  kind: 'folder' | 'student' | null
  studentId: string | null
  published: boolean | undefined
  updatedAt: string
}

// элеммент ответа с type='folder'
export type TFolderContentItem = Omit<TSectionContentItem, 'type'> & {
  type: 'folder'
}

// элемент ответа с type='pack'
export type TPackContentItem = Omit<TSectionContentItem, 'type'> & {
  type: 'pack'
}

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
