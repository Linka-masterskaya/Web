export const studentQueryKeys = {
  all: ['students'] as const,
  list: () => [...studentQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...studentQueryKeys.all, 'detail', id] as const,
}
