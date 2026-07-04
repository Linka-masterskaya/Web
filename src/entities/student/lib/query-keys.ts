export const studentQueryKeys = {
  all: ['students'] as const,
  list: (filters?: Record<string, unknown>) => [...studentQueryKeys.all, 'list', filters] as const,
  detail: (id: string) => [...studentQueryKeys.all, 'detail', id] as const,
}
