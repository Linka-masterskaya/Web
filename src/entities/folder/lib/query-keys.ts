import type { TGetSectionContentsParams } from '../model/content-item.schema'

export const folderQueryKeys = {
  all: ['folders'] as const,
  lists: () => [...folderQueryKeys.all, 'list'] as const,
  list: () => [...folderQueryKeys.lists()] as const,
  sectionContents: (params: TGetSectionContentsParams) =>
    [...folderQueryKeys.all, 'section-contents', params] as const,
}
