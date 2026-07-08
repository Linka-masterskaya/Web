import type { TLibraryCard, TLibraryCategory } from '../model/library.schema'

export const mockCategories: TLibraryCategory[] = [
  { id: 1, name: 'Животные' },
  { id: 2, name: 'События' },
  { id: 3, name: 'Играть' },
  { id: 4, name: 'Медицина' },
  { id: 5, name: 'Гигиена' },
  { id: 6, name: 'Сенсорика' },
  { id: 7, name: 'Просьбы и реакции' },
  { id: 8, name: 'Новый год' },
  { id: 9, name: 'Люди' },
  { id: 10, name: 'Продукты' },
  { id: 11, name: 'Напитки' },
  { id: 12, name: 'Посуда' },
  { id: 13, name: 'Транспорт' },
]

export const mockCards: TLibraryCard[] = [
  { id: 1, title: 'Кошка', image: 'https://placehold.co/220x162', categoryId: 1 },
  { id: 2, title: 'Собака', image: 'https://placehold.co/220x162', categoryId: 1 },
  { id: 3, title: 'Лиса', image: 'https://placehold.co/220x162', categoryId: 1 },
  { id: 4, title: 'Медведь', image: 'https://placehold.co/220x162', categoryId: 1 },
  { id: 5, title: 'Корова', image: 'https://placehold.co/220x162', categoryId: 1 },
  { id: 6, title: 'Лошадь', image: 'https://placehold.co/220x162', categoryId: 1 },
  { id: 7, title: 'Праздник', image: 'https://placehold.co/220x162', categoryId: 2 },
  { id: 8, title: 'Мяч', image: 'https://placehold.co/220x162', categoryId: 3 },
  { id: 9, title: 'Яблоко', image: 'https://placehold.co/220x162', categoryId: 10 },
  { id: 10, title: 'Лицо', image: 'https://placehold.co/220x162', categoryId: 9 },
  { id: 11, title: 'Сок', image: 'https://placehold.co/220x162', categoryId: 11 },
  { id: 12, title: 'Соль', image: 'https://placehold.co/220x162', categoryId: 10 },
  { id: 13, title: 'Сова', image: 'https://placehold.co/220x162', categoryId: 1 },
]
