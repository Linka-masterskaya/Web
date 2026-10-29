import { Button, Title } from '@mantine/core'
import { useState } from 'react'
import { LocalErrorSection } from './local-error-section'

export const TriggerErrorSection: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error('Test error')
  }

  return (
    <>
      <Title order={2} c="green" mt="md">
        Synthetic error
      </Title>

      <Button color="red" variant="outline" onClick={() => setShouldThrow(true)}>
        Trigger error
      </Button>

      <LocalErrorSection />
    </>
  )
}
