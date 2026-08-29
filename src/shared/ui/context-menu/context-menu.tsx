import { Menu } from '@mantine/core'
import React, { useCallback, useState } from 'react'
import styles from './student-grid.module.scss'
import type { TContextMenuItem, TContextMenuPosition } from './types'

type TContextMenuProps<TTarget extends object> = {
  items: readonly TContextMenuItem<TTarget>[]
  opened: boolean
  target: TTarget | null
  position: TContextMenuPosition
  width: number
  onClose: () => void
}

export function ContextMenu<TTarget extends object>({
  items,
  opened,
  target,
  position,
  width,
  onClose,
}: TContextMenuProps<TTarget>) {
  const handleMenuChange = useCallback(
    (nextOpened: boolean) => {
      if (!nextOpened) {
        onClose()
      }
    },
    [onClose],
  )

  const handleItemClick = useCallback(
    (item: TContextMenuItem<TTarget>) => {
      if (target === null) {
        return
      }

      try {
        item.onClick(target)
      } finally {
        onClose()
      }
    },
    [onClose, target],
  )

  const isItemDisabled = (item: TContextMenuItem<TTarget>): boolean => {
    if (target === null) {
      return true
    }

    if (typeof item.disabled === 'function') {
      return item.disabled(target)
    }

    return item.disabled ?? true
  }

  return (
    <Menu
      opened={opened}
      onChange={handleMenuChange}
      width={width}
      position="bottom-start"
      offset={0}
      withinPortal={false}
      closeOnItemClick={false}
      keepMounted
      classNames={{
        dropdown: styles.menuDropdown,
        item: styles.menuItem,
        divider: styles.menuDivider,
      }}
    >
      {/*
        Невидимая точка, относительно которой Mantine
        позиционирует Menu.Dropdown.
      */}
      <Menu.Target>
        <div
          key={`${position.x}-${position.y}`}
          className={styles.menuAnchor}
          style={{
            left: position.x,
            top: position.y,
          }}
        />
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <Menu.Divider />}
            <Menu.Item
              c={item.color === 'red' ? 'red.6' : 'gray.6'}
              disabled={isItemDisabled(item)}
              leftSection={item.icon}
              onClick={() => handleItemClick(item)}
            >
              {item.label}
            </Menu.Item>
          </React.Fragment>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
