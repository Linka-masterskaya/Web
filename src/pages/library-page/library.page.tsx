import type { TPackContentItem } from '@entities/section-content'
import { useOpenCopySet } from '@features/copy-set'
import { SectionContentsBrowser } from '@features/section-contents-browser'
import { Title } from '@mantine/core'
import type { TContextMenuItem } from '@shared/ui/context-menu'
import { useMemo } from 'react'

import { createLibraryContextMenuConfig } from './library-context-menu-config'
import styles from './library-page.module.scss'

export const LibraryPage: React.FC = () => {
  const openCopySet = useOpenCopySet()

  const packContextMenuItems = useMemo<TContextMenuItem<TPackContentItem>[]>(
    () =>
      createLibraryContextMenuConfig<TPackContentItem>({
        onCopyIntoMy: (pack) => {
          openCopySet({
            setId: pack.id,
            setName: pack.name,
            targetSection: 'my',
          })
        },

        onCopyIntoStudentFolder: (pack) => {
          openCopySet({
            setId: pack.id,
            setName: pack.name,
            targetSection: 'students',
          })
        },
      }),
    [openCopySet],
  )

  return (
    <section>
      <Title order={1} ta="left" className={styles.title}>
        Библиотека
      </Title>

      <SectionContentsBrowser
        section="library"
        additionalPackContextMenuItems={packContextMenuItems}
      />
    </section>
  )
}
