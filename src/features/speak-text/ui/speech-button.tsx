import { Button } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import styles from './speech-button.module.scss'

type TSpeechButtonProps = {
  onClick: () => void
  isSpeaking: boolean
}

export const SpeechButton = ({ onClick, isSpeaking }: TSpeechButtonProps) => {
  return (
    <Button
      variant="outline"
      leftSection={<Icon name="Play" size={16} />}
      loading={isSpeaking}
      disabled={isSpeaking}
      classNames={{
        root: styles.listenButton,
        section: styles.listenButtonSection,
        label: styles.listenButtonLabel,
      }}
      onClick={onClick}
    >
      Слушать
    </Button>
  )
}
