import { Anchor, Text } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router'
import { Icon } from '../icon'
import styles from './bread-crumbs.module.scss'
import type { TBreadCrumbsProps } from './types'

export const BreadCrumbs: React.FC<TBreadCrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Путь к текущей странице">
      <ol className={styles.breadCrumbsContainer}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          const isClickable = Boolean(item.href) && !isCurrent
          const shouldShowSeparator = !isCurrent

          return (
            <React.Fragment key={item.id}>
              <li>
                {isClickable ? (
                  <Anchor component={Link} to={item.href} size="sm" className={styles.link}>
                    {item.label}
                  </Anchor>
                ) : (
                  <Text
                    component="span"
                    size="sm"
                    className={isCurrent ? styles.currentPage : undefined}
                    aria-current={isCurrent && 'page'}
                  >
                    {item.label}
                  </Text>
                )}
              </li>

              {shouldShowSeparator && (
                <li className={styles.separator} aria-hidden="true">
                  <Icon
                    className={styles.separatorIcon}
                    name="ChevronRight"
                    size={16}
                    color="#787B82"
                  />
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
