import type { TLibraryCard } from '@entities/library'
import { SectionContentsBrowser } from '@features/section-contents-browser'
import type { TContextMenuItem } from '@shared/ui/context-menu'
import { ContextMenu, useContextMenu } from '@shared/ui/context-menu'
import { useMemo } from 'react'
import { createLibraryContextMenuConfig } from './library-context-menu-config'

export const LibraryPage: React.FC = () => {
  const contentMenuItems = useMemo<TContextMenuItem<TLibraryCard>[]>(() => {
    const items = createLibraryContextMenuConfig({
      onCopyIntoMy: (card: TLibraryCard) => {
        onCopyIntoMy(card)
      },
      onCopyIntoStudentFolder: (card: TLibraryCard) => {
        onCopyIntoStudentFolder(card)
      },
    })

    return items
  }, [])

  const contextMenu = useContextMenu<TLibraryCard>()
  return (
    <section>
      <ContextMenu<TLibraryCard> items={contentMenuItems} {...contextMenu.menuProps} />
      <h2>Библиотека</h2>
      <SectionContentsBrowser section="library" />
    </section>
  )
}
