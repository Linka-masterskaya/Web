// Имитация задержки
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Заглушка для смены аватара.
 * TODO: заменить на реальный запрос к бэкенду, когда будет готов.
 */

export const changeUserAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  // TODO: убрать, когда появится бэкенд
  // biome-ignore lint/suspicious/noConsole: debug only
  console.log('Аватар изменён')

  // Имитация ответа от сервера (задержка 500 мс)
  // TODO: убрать, когда появится бэкенд
  await delay(500)

  // Возвращаем временную ссылку на файл (пока нет бэкенда)
  // TODO: заменить на реальный URL от сервера
  return { avatarUrl: URL.createObjectURL(file) }
}

/**
 * Заглушка для удаления аватара.
 * TODO: заменить на реальный запрос к бэкенду, когда будет готов.
 */
export const deleteUserAvatar = async (): Promise<void> => {
  // TODO: убрать, когда появится бэкенд
  // biome-ignore lint/suspicious/noConsole: debug only
  console.log('Аватар удалён')

  // Имитация ответа от сервера (задержка 300 мс)
  // TODO: убрать, когда появится бэкенд
  await delay(300)
}
