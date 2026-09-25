import type { TSetLocationState } from '@entities/set'
import { isHeadDefectologist, useUserStore } from '@entities/user'
import { useOpenCreateFolder } from '@features/create-folder'
import {
  SectionContentsBrowser,
  type TSectionFolderContext,
} from '@features/section-contents-browser'
import { Button, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import styles from './library-page.module.scss'

const ROOT_FOLDER_CONTEXT: TSectionFolderContext = {
  isRoot: true,
}

export const LibraryPage: React.FC = () => {
  // Редактирование Библиотеки доступно только главному методисту
  const role = useUserStore((state) => state.role)
  const canEditLibrary = isHeadDefectologist(role)
  const navigate = useNavigate()
  const openCreateFolder = useOpenCreateFolder()
  const [folderContext, setFolderContext] = useState<TSectionFolderContext>(ROOT_FOLDER_CONTEXT)

  const handleFolderContextChange = useCallback((context: TSectionFolderContext) => {
    setFolderContext(context)
  }, [])

  const handleCreateFolder = () => {
    openCreateFolder({
      section: 'library',
      parentId: null,
    })
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <Title order={1} ta="left" className={styles.title}>
          Библиотека
        </Title>

        {canEditLibrary && folderContext.isRoot && (
          <Button
            variant="filled"
            classNames={{ inner: styles.createActionInner }}
            leftSection={<Icon name="Folder" size={20} />}
            onClick={handleCreateFolder}
          >
            Создать папку
          </Button>
        )}
      </div>

      <SectionContentsBrowser
        section="library"
        dashboardHref={createUrl(routerPath.dashboard)}
        onFolderContextChange={handleFolderContextChange}
        onOpenPack={(pack, context) => {
          const locationState: TSetLocationState = {
            section: 'library',
            folderId: context.currentFolderId,
          }

          navigate(
            createUrl(routerPath.dashboardSetId, { setId: pack.id }, { section: 'library' }),
            { state: locationState },
          )
        }}
      />
    </section>
  )
}
