import { ActionIcon } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { Icon } from '@shared/ui/icon'
import { UserProfile } from '@widgets/user-profile'
import clsx from 'clsx'
import { useState } from 'react'
import styles from './profile-toggle.module.scss'

export const ProfileToggleButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const rootRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false)
  })

  const handleToggleProfile = () => {
    setIsOpen((prev) => !prev)
  }

  const handleCloseProfile = () => {
    setIsOpen(false)
  }

  return (
    <div ref={rootRef} className={styles.wrapper}>
      <ActionIcon
        className={clsx(styles.button, isOpen && styles.buttonActive)}
        type="button"
        size="28px"
        variant="transparent"
        aria-label="Открыть профиль"
        aria-expanded={isOpen}
        onClick={handleToggleProfile}
      >
        <Icon name="User" />
      </ActionIcon>

      {isOpen && (
        <div className={styles.profile}>
          <UserProfile onClose={handleCloseProfile} />
        </div>
      )}
    </div>
  )
}
