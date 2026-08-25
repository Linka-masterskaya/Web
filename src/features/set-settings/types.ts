import type { TSetSettings } from './model/set-settings.schema'

export type TSetSettingsProps = {
  defaultValues?: Partial<TSetSettings>
  onClose?: () => void
  onSave?: (values: TSetSettings) => void | Promise<void>
}
