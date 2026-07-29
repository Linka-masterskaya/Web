export const setQueryKeys = {
  all: ['sets'] as const,
  details: () => [...setQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...setQueryKeys.details(), id] as const,
}
