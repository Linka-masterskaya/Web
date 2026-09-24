import { isHeadDefectologist, useUserStore } from '@entities/user'
import { useOpenCreateFolder } from '@features/create-folder'
import {
  SectionContentsBrowser,
  type TSectionFolderContext,
} from '@features/section-contents-browser'
import { Button, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { useCallback, useState } from 'react'
import styles from './library-page.module.scss'

const ROOT_FOLDER_CONTEXT: TSectionFolderContext = {
  isRoot: true,
}

export const LibraryPage: React.FC = () => {
  // Папки Библиотеки создаёт только главный методист (остальным раздел доступен для чтения и копирования)
  const role = useUserStore((state) => state.role)
  const canEditLibrary = isHeadDefectologist(role)
  const openCreateFolder = useOpenCreateFolder()
  const [folderContext, setFolderContext] = useState<TSectionFolderContext>(ROOT_FOLDER_CONTEXT)

  const handleFolderContextChange = useCallback((context: TSectionFolderContext) => {
    setFolderContext(context)
  }, [])

  const handleCreateFolder = () => {
    openCreateFolder({
      section: 'library',
      parentId: folderContext.currentFolderId ?? null,
    })
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <Title order={1} ta="left" className={styles.title}>
          Библиотека
        </Title>

        {canEditLibrary && (
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

      <SectionContentsBrowser section="library" onFolderContextChange={handleFolderContextChange} />
    </section>
  )
}
