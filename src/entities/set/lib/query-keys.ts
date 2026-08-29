export const setQueryKeys = {
  all: ['sets'] as const,
  lists: () => [...setQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...setQueryKeys.lists(), filters] as const,
  details: () => [...setQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...setQueryKeys.details(), id] as const,
}

export const setMutationKeys = {
  updatePageType: (id: string) => [...setQueryKeys.detail(id), 'update-page-type'] as const,
  updatePageStructure: (id: string) =>
    [...setQueryKeys.detail(id), 'update-page-structure'] as const,
  updateTitle: (id: string) => [...setQueryKeys.detail(id), 'update-title'] as const,
}
