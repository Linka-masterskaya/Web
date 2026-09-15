import { useMutation } from '@tanstack/react-query'
import { importLibraryPicture } from '../api/import-library-picture'

export const useImportLibraryPicture = () =>
  useMutation({
    mutationFn: importLibraryPicture,
  })
