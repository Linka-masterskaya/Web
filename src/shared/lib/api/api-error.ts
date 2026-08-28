import { HTTPError, SchemaValidationError } from 'ky'

type TApiErrorBody = {
  error?: {
    code?: string
    message?: string
  }
}

const FALLBACK_MESSAGE = 'Не удалось выполнить запрос. Попробуйте позже'

/**
 * Синхронно достаёт сообщение о несовпадении ответа схеме (ky SchemaValidationError).
 * Возвращает null, если ошибка не про валидацию схемы.
 */
export const getSchemaValidationMessage = (error: unknown): string | null => {
  if (!(error instanceof SchemaValidationError)) {
    return null
  }

  const [firstIssue] = error.issues

  if (!firstIssue) {
    return 'Ответ сервера не соответствует ожидаемой схеме'
  }

  const path = firstIssue.path?.length ? firstIssue.path.join('.') : 'ответ'
  return `Ответ сервера не соответствует схеме: «${path}» — ${firstIssue.message}`
}

/**
 * Достаёт человекочитаемое сообщение из ошибки API.
 * Бэкенд отвечает в формате { error: { code, message, details } }.
 */
export const getApiErrorMessage = async (error: unknown): Promise<string> => {
  const schemaMessage = getSchemaValidationMessage(error)
  if (schemaMessage) {
    return schemaMessage
  }

  if (error instanceof HTTPError) {
    try {
      const body = (await error.response.clone().json()) as TApiErrorBody
      if (body.error?.message) {
        return body.error.message
      }
    } catch {
      // тело не JSON — падаем вниз к общим случаям
    }

    if (error.response.status === 401) {
      return 'Сессия истекла. Войдите заново'
    }

    if (error.response.status >= 500) {
      return 'Сервер временно недоступен. Попробуйте позже'
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return FALLBACK_MESSAGE
}
