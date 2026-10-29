type TLocalErrorTriggerProps = {
  shouldThrow: boolean
}

export const LocalErrorTrigger: React.FC<TLocalErrorTriggerProps> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Local block test error')
  }

  return null
}
