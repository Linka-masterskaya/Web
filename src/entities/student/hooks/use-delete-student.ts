import { folderQueryKeys, useDeleteFolder } from '@entities/folder'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteStudent } from '../api/delete-student'
import { studentQueryKeys } from '../lib/query-keys'

type TDeleteStudentParams = {
  studentId: string
  folderId: string
}

export const useDeleteStudent = () => {
  const queryClient = useQueryClient()
  const deleteFolderMutation = useDeleteFolder()

  return useMutation({
    mutationFn: async ({ studentId, folderId }: TDeleteStudentParams) => {
      await deleteFolderMutation.mutateAsync(folderId)
      await deleteStudent(studentId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: folderQueryKeys.all })
    },
  })
}
