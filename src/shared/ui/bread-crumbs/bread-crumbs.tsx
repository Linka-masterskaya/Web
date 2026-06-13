import React from 'react'
import { Icon } from '../icon'
import styles from './bread-crumbs.module.scss'
import type { TBreadCrumbsProps } from './types'

export const BreadCrumbs: React.FC<TBreadCrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Путь к текущей странице">
      <ol className={styles.breadCrumbsContainer}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const hasHref = Boolean(item.href)
          const isCurrent = isLast || !hasHref
          const shouldShowSeparator = !isLast

          return (
            <React.Fragment key={item.id}>
              <li>
                {isCurrent ? (
                  <span
                    className={styles.currentPage}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a className={styles.link} href={item.href}>
                    {item.label}
                  </a>
                )}
              </li>

              {shouldShowSeparator && (
                <li aria-hidden="true">
                  <Icon name="ChevronRight" color="#787B82" />
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
