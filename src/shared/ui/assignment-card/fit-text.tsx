import { useLayoutEffect, useRef } from 'react'
import styles from './assignment-card.module.scss'

type TFitTextProps = {
  text: string
  /** Доля высоты контейнера, которую может занять текст */
  heightRatio?: number
  minFontSize?: number
  maxFontSize?: number
}

/** Подгоняет font-size так, чтобы текст с переносами влез в контейнер. */
export const FitText: React.FC<TFitTextProps> = ({
  text,
  heightRatio = 0.9,
  minFontSize = 12,
  maxFontSize = 200,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const textEl = textRef.current
    if (!container || !textEl) return

    const fit = () => {
      const maxWidth = container.clientWidth
      const maxHeight = container.clientHeight * heightRatio
      if (maxWidth <= 0 || maxHeight <= 0) return

      let low = minFontSize
      let high = maxFontSize
      let best = minFontSize

      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        textEl.style.fontSize = `${mid}px`
        const fitsWidth = textEl.scrollWidth <= maxWidth + 0.5
        const fitsHeight = textEl.scrollHeight <= maxHeight + 0.5
        if (fitsWidth && fitsHeight) {
          best = mid
          low = mid + 1
        } else {
          high = mid - 1
        }
      }

      textEl.style.fontSize = `${best}px`
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    return () => observer.disconnect()
  }, [text, heightRatio, minFontSize, maxFontSize])

  return (
    <span ref={containerRef} className={styles.cardTitleFit}>
      <span ref={textRef} className={styles.cardTitleFitText}>
        {text}
      </span>
    </span>
  )
}
