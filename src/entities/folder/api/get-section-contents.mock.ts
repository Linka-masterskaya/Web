import {
  getSectionContentsParamsSchema,
  type TContentItem,
  type TGetSectionContentsParams,
  type TSection,
  type TSectionContentsResponse,
} from '../model/content-item.schema'

const ROOT_KEY = '__root__'

const DEFAULT_UPDATED_AT = '2026-08-20T12:00:00.000Z'

const ids = {
  mySport: '10000000-0000-4000-8000-000000000001',
  myVegetables: '10000000-0000-4000-8000-000000000002',
  myFruits: '10000000-0000-4000-8000-000000000003',
  myAnimals: '10000000-0000-4000-8000-000000000004',
  myTeamGames: '10000000-0000-4000-8000-000000000005',

  packRunning: '20000000-0000-4000-8000-000000000001',
  packExercise: '20000000-0000-4000-8000-000000000002',
  packFootball: '20000000-0000-4000-8000-000000000003',
  packBasketball: '20000000-0000-4000-8000-000000000004',

  librarySpeech: '30000000-0000-4000-8000-000000000001',
  libraryMath: '30000000-0000-4000-8000-000000000002',
  librarySoundsPack: '31000000-0000-4000-8000-000000000001',
  libraryNumbersPack: '31000000-0000-4000-8000-000000000002',

  studentIvan: '40000000-0000-4000-8000-000000000001',
  studentAnna: '40000000-0000-4000-8000-000000000002',
  studentIvanId: '41000000-0000-4000-8000-000000000001',
  studentAnnaId: '41000000-0000-4000-8000-000000000002',
  studentIvanPack: '42000000-0000-4000-8000-000000000001',
  studentAnnaPack: '42000000-0000-4000-8000-000000000002',
} as const

type TCreateFolderOptions = {
  kind?: 'folder' | 'student'
  studentId?: string | null
  updatedAt?: string
}

/**
 * Создаёт мок обычной папки или папки ученика.
 */
const createFolder = (
  id: string,
  name: string,
  options: TCreateFolderOptions = {},
): TContentItem => ({
  type: 'folder',
  id,
  name,
  kind: options.kind ?? 'folder',
  studentId: options.studentId ?? null,
  published: undefined,
  updatedAt: options.updatedAt ?? DEFAULT_UPDATED_AT,
})

/**
 * Создаёт мок набора.
 */
const createPack = (id: string, name: string, published = false): TContentItem => ({
  type: 'pack',
  id,
  name,
  kind: null,
  studentId: null,
  published,
  updatedAt: DEFAULT_UPDATED_AT,
})

type TMockSectionTree = Record<string, readonly TContentItem[]>

/**
 * Дерево моковых данных.
 *
 * Ключ __root__ содержит корневые папки.
 * Ключ с UUID папки содержит элементы внутри неё.
 */
const mockTree: Record<TSection, TMockSectionTree> = {
  my: {
    [ROOT_KEY]: [
      createFolder(ids.mySport, 'Спорт'),
      createFolder(ids.myVegetables, 'Овощи'),
      createFolder(ids.myFruits, 'Фрукты'),
      createFolder(ids.myAnimals, 'Животные'),
    ],

    [ids.mySport]: [
      createFolder(ids.myTeamGames, 'Командные игры'),
      createPack(ids.packRunning, 'Бег и движение'),
      createPack(ids.packExercise, 'Утренняя зарядка', true),
    ],

    [ids.myTeamGames]: [
      createPack(ids.packFootball, 'Футбол'),
      createPack(ids.packBasketball, 'Баскетбол'),
    ],

    [ids.myVegetables]: [],
    [ids.myFruits]: [],
    [ids.myAnimals]: [],
  },

  library: {
    [ROOT_KEY]: [
      createFolder(ids.librarySpeech, 'Развитие речи'),
      createFolder(ids.libraryMath, 'Математика'),
    ],

    [ids.librarySpeech]: [createPack(ids.librarySoundsPack, 'Звуки и слова', true)],

    [ids.libraryMath]: [createPack(ids.libraryNumbersPack, 'Числа от 1 до 10', true)],
  },

  students: {
    [ROOT_KEY]: [
      createFolder(ids.studentIvan, 'Иванов Иван', {
        kind: 'student',
        studentId: ids.studentIvanId,
      }),
      createFolder(ids.studentAnna, 'Сергеева Анна', {
        kind: 'student',
        studentId: ids.studentAnnaId,
      }),
    ],

    [ids.studentIvan]: [createPack(ids.studentIvanPack, 'Индивидуальное занятие')],

    [ids.studentAnna]: [createPack(ids.studentAnnaPack, 'Развитие внимания')],
  },
}

/**
 * Имитирует небольшую задержку настоящего сервера
 */
const wait = (delay: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, delay)
  })

/**
 * Сравнивает два элемента для моковой сортировки.
 */
const compareItems = (
  left: TContentItem,
  right: TContentItem,
  sort: 'name' | 'updated_at',
): number => {
  if (sort === 'updated_at') {
    return left.updatedAt.localeCompare(right.updatedAt)
  }

  return left.name.localeCompare(right.name, 'ru', {
    sensitivity: 'base',
  })
}

/**
 * Возвращает моковое содержимое раздела или папки.
 */
export const getSectionContentsMock = async (
  params: TGetSectionContentsParams,
): Promise<TSectionContentsResponse> => {
  const parsed = getSectionContentsParamsSchema.parse(params)

  const { section, parentId, limit = 50, offset = 0, sort = 'name', order = 'asc' } = parsed

  await wait(300)

  const parentKey = parentId ?? ROOT_KEY

  const sourceItems = mockTree[section][parentKey] ?? []

  const sortedItems = [...sourceItems].sort((left, right) => {
    const comparison = compareItems(left, right, sort)

    if (comparison !== 0) {
      return order === 'desc' ? -comparison : comparison
    }

    return left.id.localeCompare(right.id)
  })

  return {
    items: sortedItems.slice(offset, offset + limit),
    limit,
    offset,
  }
}
