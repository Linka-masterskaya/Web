import { useOpenCreateFolder } from '@features/create-folder'
import { useOpenCreateSet } from '@features/create-set'
import {
  SectionContentsBrowser,
  type TSectionFolderContext,
} from '@features/section-contents-browser'
import { Button, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import styles from './sets-page.module.scss'

const ROOT_FOLDER_CONTEXT: TSectionFolderContext = {
  isRoot: true,
}

export const SetsPage: React.FC = () => {
  const navigate = useNavigate()
  const openCreateFolder = useOpenCreateFolder()
  const openCreateSet = useOpenCreateSet()
  const [folderContext, setFolderContext] = useState<TSectionFolderContext>(ROOT_FOLDER_CONTEXT)

  const handleFolderContextChange = useCallback((context: TSectionFolderContext) => {
    setFolderContext(context)
  }, [])

  const handleCreateFolder = () => {
    openCreateFolder({ section: 'my', parentId: null })
  }

  const handleCreateSet = () => {
    if (!folderContext.currentFolderId) {
      return
    }

    openCreateSet({ folderId: folderContext.currentFolderId })
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <Title order={1} ta="left" className={styles.title}>
          Мои наборы
        </Title>

        {folderContext.isRoot ? (
          <Button
            variant="filled"
            classNames={{ inner: styles.createActionInner }}
            leftSection={<Icon name="Folder" size={20} />}
            onClick={handleCreateFolder}
          >
            Создать папку
          </Button>
        ) : (
          <Button
            variant="filled"
            classNames={{ inner: styles.createActionInner }}
            leftSection={<Icon name="Grid3x3" size={20} />}
            onClick={handleCreateSet}
          >
            Создать набор
          </Button>
        )}
      </div>

      <SectionContentsBrowser
        section="my"
        dashboardHref={createUrl(routerPath.dashboard)}
        onFolderContextChange={handleFolderContextChange}
        onOpenPack={(pack) => {
          navigate(createUrl(routerPath.dashboardSetId, { setId: pack.id }))
        }}
      />
    </section>
  )
}
