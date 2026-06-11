import clsx from 'clsx'
import { useState } from 'react'
import { SidePanel } from './side-panel/side-panel'
import styles from './subset-layout.module.scss'
import type { TSubsetLayoutProps } from './types'

export const SubsetLayout: React.FC<TSubsetLayoutProps> = ({
  leftSlot,
  rightSlot,
  children,
  className,
}) => {
  const [isLeftOpen, setLeftOpen] = useState(true)
  const [isRightOpen, setRightOpen] = useState(true)

  return (
    <div
      className={clsx(styles.subsetLayout, className)}
      data-left-opened={isLeftOpen ? 'true' : 'false'}
      data-right-opened={isRightOpen ? 'true' : 'false'}
    >
      <SidePanel side="left" opened={isLeftOpen} onToggle={() => setLeftOpen((value) => !value)}>
        {leftSlot}
      </SidePanel>

      <div>{children}</div>

      <SidePanel side="right" opened={isRightOpen} onToggle={() => setRightOpen((value) => !value)}>
        {rightSlot}
      </SidePanel>
    </div>
  )
}
