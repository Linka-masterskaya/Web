import { Button, Popover } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import { useState } from 'react'
import { Link } from 'react-router'

import styles from './create-entity.module.scss'
import type { TCreateEntityProps } from './types'

export const CreateEntity = ({ config, className }: TCreateEntityProps) => {
  const [opened, setOpened] = useState(false)

  if (!config.actions.length) {
    return null
  }

  if (config.actions.length === 1) {
    const action = config.actions[0]
    const buttonProps = {
      variant: 'filled' as const,
      className: clsx(styles.button, className),
      leftSection: <Icon size={16} name="Plus" />,
      onClick: action.onClick,
      children: action.label,
    }

    if (action.link) {
      return <Button component={Link} to={action.link} {...buttonProps} />
    }

    return <Button {...buttonProps} />
  }

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      withinPortal
      position="bottom-end"
      offset={8}
      shadow="lg"
    >
      <Popover.Target>
        <Button
          variant="filled"
          className={clsx(styles.button, opened && styles.buttonOpened, className)}
          leftSection={<Icon size={16} name="Plus" />}
          onClick={() => setOpened((prev) => !prev)}
        >
          Создать
        </Button>
      </Popover.Target>

      <Popover.Dropdown className={styles.dropdown}>
        {config.actions.map((action, index) => {
          const handleActionClick = () => {
            action.onClick?.()
            setOpened(false)
          }

          if (action.link) {
            return (
              <Button
                key={action.label}
                component={Link}
                to={action.link}
                variant={index === 0 ? 'filled' : 'outline'}
                fullWidth
                leftSection={<Icon size={16} name={action.icon} />}
                className={styles.action}
                onClick={handleActionClick}
              >
                {action.label}
              </Button>
            )
          }

          return (
            <Button
              key={action.label}
              variant={index === 0 ? 'filled' : 'outline'}
              fullWidth
              leftSection={<Icon size={16} name={action.icon} />}
              className={styles.action}
              onClick={handleActionClick}
            >
              {action.label}
            </Button>
          )
        })}
      </Popover.Dropdown>
    </Popover>
  )
}
