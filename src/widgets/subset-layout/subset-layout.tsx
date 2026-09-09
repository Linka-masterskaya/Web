import clsx from 'clsx'
import { useId, useState } from 'react'
import { SidePanel } from './side-panel/side-panel'
import styles from './subset-layout.module.scss'
import type { TSubsetLayoutProps } from './types'

export const SubsetLayout: React.FC<TSubsetLayoutProps> = ({
  leftSlot,
  leftCollapsedSlot,
  rightSlot,
  rightCollapsedSlot,
  leftTitle,
  rightTitle,
  children,
  className,
  collapsible = true,
  defaultLeftOpened = true,
  defaultRightOpened = true,
}) => {
  const leftPanelId = useId()
  const rightPanelId = useId()
  const [isLeftOpened, setIsLeftOpened] = useState(defaultLeftOpened)
  const [isRightOpened, setIsRightOpened] = useState(defaultRightOpened)

  const hasLeftPanel = leftSlot != null
  const hasRightPanel = rightSlot != null
  const isLeftPanelOpened = hasLeftPanel && (!collapsible || isLeftOpened)
  const isRightPanelOpened = hasRightPanel && (!collapsible || isRightOpened)

  return (
    <div
      className={clsx(styles.subsetLayout, className)}
      data-has-left-panel={hasLeftPanel ? 'true' : 'false'}
      data-has-right-panel={hasRightPanel ? 'true' : 'false'}
      data-left-opened={isLeftPanelOpened ? 'true' : 'false'}
      data-right-opened={isRightPanelOpened ? 'true' : 'false'}
    >
      {hasLeftPanel && (
        <SidePanel
          id={leftPanelId}
          side="left"
          title={leftTitle}
          opened={isLeftPanelOpened}
          collapsible={collapsible}
          onToggle={() => setIsLeftOpened((opened) => !opened)}
          collapsedContent={leftCollapsedSlot}
        >
          {leftSlot}
        </SidePanel>
      )}

      <div className={styles.content}>{children}</div>

      {hasRightPanel && (
        <SidePanel
          id={rightPanelId}
          side="right"
          title={rightTitle}
          opened={isRightPanelOpened}
          collapsible={collapsible}
          onToggle={() => setIsRightOpened((opened) => !opened)}
          collapsedContent={rightCollapsedSlot}
        >
          {rightSlot}
        </SidePanel>
      )}
    </div>
  )
}
