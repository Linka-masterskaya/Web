import { folderQueryKeys, type TSectionContentsResponse } from '@entities/folder'
import { type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { addSetFavorite } from '../api/add-set-favorite'
import { removeSetFavorite } from '../api/remove-set-favorite'

type TToggleSetFavoriteParams = {
  setId: string
  nextFavorite: boolean
}

const sectionContentsQueryFilter = {
  queryKey: [...folderQueryKeys.all, 'section-contents'] as const,
}

const patchFavoriteInSectionCaches = (
  queryClient: QueryClient,
  setId: string,
  nextFavorite: boolean,
) => {
  const queries = queryClient.getQueryCache().findAll(sectionContentsQueryFilter)

  for (const query of queries) {
    const isFavoriteFilterActive = query.queryKey.at(-1) === true

    queryClient.setQueryData<TSectionContentsResponse>(query.queryKey, (current) => {
      if (!current) {
        return current
      }

      const items = current.items.flatMap((item) => {
        if (item.type !== 'pack' || item.id !== setId) {
          return [item]
        }

        if (!nextFavorite && isFavoriteFilterActive) {
          return []
        }

        return [{ ...item, isFavorite: nextFavorite }]
      })

      return {
        ...current,
        items,
        total: Math.max(0, current.total - (current.items.length - items.length)),
      }
    })
  }
}

export const useToggleSetFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ setId, nextFavorite }: TToggleSetFavoriteParams) => {
      if (nextFavorite) {
        await addSetFavorite(setId)
      } else {
        await removeSetFavorite(setId)
      }
    },
    onMutate: async ({ setId, nextFavorite }) => {
      await queryClient.cancelQueries(sectionContentsQueryFilter)

      const previousSectionContents = queryClient.getQueriesData<TSectionContentsResponse>(
        sectionContentsQueryFilter,
      )

      patchFavoriteInSectionCaches(queryClient, setId, nextFavorite)

      return { previousSectionContents }
    },
    onError: (_error, _variables, context) => {
      context?.previousSectionContents.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
  })
}
