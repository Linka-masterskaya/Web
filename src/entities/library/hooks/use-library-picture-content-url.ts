import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { getLibraryPictureContent } from '../api/get-library-picture-content'
import { libraryQueryKeys } from '../lib/query-keys'

export const useLibraryPictureContentUrl = (pictureId: string) => {
  const objectUrlRef = useRef<string | null>(null)

  const query = useQuery({
    queryKey: libraryQueryKeys.pictureContent(pictureId),
    queryFn: async () => {
      const blob = await getLibraryPictureContent(pictureId)

      return URL.createObjectURL(blob)
    },
    enabled: pictureId.trim().length > 0,
    retry: 1,
    staleTime: 0,
    gcTime: 0,
  })

  useEffect(() => {
    if (query.data && query.data !== objectUrlRef.current) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }

      objectUrlRef.current = query.data
    }
  }, [query.data])

  useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    },
    [],
  )

  return query
}
