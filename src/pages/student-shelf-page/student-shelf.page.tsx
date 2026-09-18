import { useStudentFolder } from '@entities/folder'
import { SectionContentsBrowser } from '@features/section-contents-browser'
import { Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate, useParams } from 'react-router'
import styles from './student-shelf-page.module.scss'

export const StudentShelfPage: React.FC = () => {
  const navigate = useNavigate()
  const { id: studentId } = useParams<{ id: string }>()
  const { folderId } = useStudentFolder(studentId)

  return (
    <section className={styles.page}>
      <Title order={1} ta="left" className={styles.title}>
        Полка ученика
      </Title>

      {folderId && (
        <SectionContentsBrowser
          section="students"
          initialFolderId={folderId}
          dashboardHref={createUrl(routerPath.dashboardStudents)}
          onOpenPack={(pack) => {
            navigate(
              createUrl(routerPath.dashboardSetId, {
                setId: pack.id,
              }),
            )
          }}
        />
      )}
    </section>
  )
}
