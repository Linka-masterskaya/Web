import type { TSetPage } from '@entities/set'
import type { TContextMenuItem } from '@shared/ui/context-menu'

/**
 * Цель меню: конкретная карточка страницы либо пустое место области карточек
 * (`page: null`) — тогда доступна только вставка, и она идёт в конец набора.
 */
export type TSetPageContextMenuTarget = {
  page: TSetPage | null
}

type TSetPageContextMenuParams = {
  /** Есть ли что вставлять: буфер обмена заполнен. */
  canPaste: boolean
  /** Блокирует пункты, пока идёт сохранение. */
  disabled: boolean
  onCopy: (page: TSetPage) => void
  onDuplicate: (page: TSetPage) => void
  onCut: (page: TSetPage) => void
  /** `page: null` — вставка в конец набора (клик по пустому месту области). */
  onPaste: (page: TSetPage | null) => void
  onDelete: (page: TSetPage) => void
}

/**
 * Конфиг контекстного меню страниц набора.
 * Разделитель ставится автоматически — только перед последним пунктом («Удалить»).
 * Пункты, которым нужна карточка, блокируются, когда меню открыто по пустому месту.
 */
export const createSetPageContextMenuConfig = ({
  canPaste,
  disabled,
  onCopy,
  onDuplicate,
  onCut,
  onPaste,
  onDelete,
}: TSetPageContextMenuParams): TContextMenuItem<TSetPageContextMenuTarget>[] => {
  const withoutPage = (target: TSetPageContextMenuTarget) => disabled || target.page === null

  return [
    {
      id: 'copy',
      label: 'Копировать',
      disabled: withoutPage,
      onClick: (target) => {
        if (target.page) {
          onCopy(target.page)
        }
      },
    },
    {
      id: 'duplicate',
      label: 'Дублировать',
      disabled: withoutPage,
      onClick: (target) => {
        if (target.page) {
          onDuplicate(target.page)
        }
      },
    },
    {
      id: 'cut',
      label: 'Вырезать',
      disabled: withoutPage,
      onClick: (target) => {
        if (target.page) {
          onCut(target.page)
        }
      },
    },
    {
      id: 'paste',
      label: 'Вставить',
      disabled: disabled || !canPaste,
      onClick: (target) => onPaste(target.page),
    },
    {
      id: 'delete',
      label: 'Удалить',
      color: 'red',
      disabled: withoutPage,
      onClick: (target) => {
        if (target.page) {
          onDelete(target.page)
        }
      },
    },
  ]
}
