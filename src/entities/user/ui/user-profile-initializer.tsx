import { useUserProfile } from '../hooks/use-user-profile'

export const UserProfileInitializer = () => {
  // Загружаем профиль (в том числе роль) при запуске приложения и после логина
  useUserProfile()

  return null
}
