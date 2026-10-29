import { Stack, UnstyledButton } from '@mantine/core'
import clsx from 'clsx'
import styles from './library-categories.module.scss'
import type { TLibraryCategoriesProps } from './types'

export const LibraryCategories: React.FC<TLibraryCategoriesProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
}) => (
  <Stack gap="xs">
    {categories.map((category) => {
      const isActive = category.id === selectedCategoryId

      return (
        <UnstyledButton
          key={category.id}
          className={clsx(styles.category, isActive && styles.active)}
          aria-pressed={isActive}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </UnstyledButton>
      )
    })}
  </Stack>
)
