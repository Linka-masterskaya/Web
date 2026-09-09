export interface IImportMetaEnv {
  readonly VITE_API_DOMAIN: string

  readonly VITE_TEST_NUMBER: number
  readonly VITE_TEST_BOOLEAN: boolean
  readonly VITE_TEST_UNDEFINED?: string
  readonly VITE_TTS_DEFAULT_TEXT: string
}
