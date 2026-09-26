import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import styles from './sortable-option-card.module.scss'

type SortableOptionCardProps = {
  id: string
  children: React.ReactNode
}

export const SortableOptionCard: React.FC<SortableOptionCardProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined, // поменять
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.optionCard}
      data-dragging={isDragging || undefined}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}
