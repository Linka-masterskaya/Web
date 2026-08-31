export interface IImportMetaEnv {
  readonly VITE_API_DOMAIN: string

  // включает локальные данные папок и наборов, вместо настоящего запроса к бэку
  readonly VITE_USE_SECTION_CONTENTS_MOCK?: boolean

  readonly VITE_TEST_NUMBER: number
  readonly VITE_TEST_BOOLEAN: boolean
  readonly VITE_TEST_UNDEFINED?: string
}
