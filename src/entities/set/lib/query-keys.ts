export const setQueryKeys = {
  all: ['sets'] as const,
  lists: () => [...setQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...setQueryKeys.lists(), filters] as const,
  details: () => [...setQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...setQueryKeys.details(), id] as const,
}
