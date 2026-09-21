import { useSectionContents } from './use-section-contents'

/** Находим student folder по id ученика */
export const useStudentFolder = (studentId: string | undefined) => {
  const query = useSectionContents({
    section: 'students',
    limit: 50,
    offset: 0,
  })

  const folder = query.data?.items.find(
    (item) => item.type === 'folder' && item.kind === 'student' && item.studentId === studentId,
  )

  return {
    ...query,
    folder,
    folderId: folder?.id,
  }
}
