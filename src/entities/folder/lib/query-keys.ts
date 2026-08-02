export const folderQueryKeys = {
  all: ['folders'] as const,
  lists: () => [...folderQueryKeys.all, 'list'] as const,
  list: () => [...folderQueryKeys.lists()] as const,
}
