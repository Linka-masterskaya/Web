import { Menu } from '@mantine/core'
import type { TContextMenuItem, TContextMenuPosition } from '@shared/ui/context-menu'
import React, { useCallback } from 'react'
import type { TSetPageContextMenuTarget } from '../model/context-menu-config'
import styles from './set-page-context-menu.module.scss'

type TSetPageContextMenuProps = {
  items: readonly TContextMenuItem<TSetPageContextMenuTarget>[]
  opened: boolean
  target: TSetPageContextMenuTarget | null
  position: TContextMenuPosition
  /** Ширина Menu.Dropdown: число (px) или CSS-значение, например 'max-content'. */
  width: number | string
  onClose: () => void
}

/**
 * Контекстное меню страниц набора.
 *
 * Вёрстка Menu.Dropdown своя, а не из @shared/ui/context-menu: общий компонент
 * ставит разделитель перед каждым пунктом и не даёт задать зазор/отступ у пунктов.
 * Позиционирование и состояние берём из общего хука useContextMenu.
 * Иконки пунктов здесь не рендерятся — в этом меню их нет по дизайну.
 * Меню закрывается, когда курсор уходит за его пределы.
 */
export const SetPageContextMenu: React.FC<TSetPageContextMenuProps> = ({
  items,
  opened,
  target,
  position,
  width,
  onClose,
}) => {
  const handleMenuChange = useCallback(
    (nextOpened: boolean) => {
      if (!nextOpened) {
        onClose()
      }
    },
    [onClose],
  )

  const handleItemClick = useCallback(
    (item: TContextMenuItem<TSetPageContextMenuTarget>) => {
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

  const isItemDisabled = (item: TContextMenuItem<TSetPageContextMenuTarget>): boolean => {
    if (typeof item.disabled === 'function') {
      return target === null ? true : item.disabled(target)
    }

    return item.disabled ?? false
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

      {/* onMouseLeave здесь — «меню закрывается, когда курсор уходит за его пределы». */}
      <Menu.Dropdown className={styles.dropdown} onMouseLeave={onClose}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {/* Разделитель — только перед последним пунктом (деструктивным действием). */}
            {index > 0 && index === items.length - 1 && <Menu.Divider className={styles.divider} />}
            <Menu.Item
              className={styles.item}
              c={item.color === 'red' ? 'red.6' : 'gray.6'}
              disabled={isItemDisabled(item)}
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
