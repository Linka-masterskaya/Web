import { getEnv, getRequiredEnv } from './get-env'

export const env = {
  apiDomain: () => getRequiredEnv('VITE_API_DOMAIN'),
  testNumber: () => getRequiredEnv('VITE_TEST_NUMBER', 'number'),
  testBoolean: () => getRequiredEnv('VITE_TEST_BOOLEAN', 'boolean'),
  testUndefined: () => getEnv('VITE_TEST_UNDEFINED'),
} as const
