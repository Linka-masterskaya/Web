import type { TGetSectionContentsParams } from '../model/content-item.schema'

export const folderQueryKeys = {
  all: ['folders'] as const,
  lists: () => [...folderQueryKeys.all, 'list'] as const,
  list: () => [...folderQueryKeys.lists()] as const,
  sectionContents: ({ section, parentId, limit, offset, sort, order }: TGetSectionContentsParams) =>
    [
      ...folderQueryKeys.all,
      'section-contents',
      section,
      parentId ?? null,
      limit,
      offset,
      sort,
      order,
    ] as const,
}
