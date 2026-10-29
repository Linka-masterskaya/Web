import { isAccessLevelVisible } from '@entities/auth'
import type { TMainMenuItem } from '../config'
import { mainMenuConfig } from '../config'

export const getVisibleMenuItems = (isAuth: boolean): TMainMenuItem[] =>
  mainMenuConfig.items.filter((item) => isAccessLevelVisible(item.accessLevel, isAuth))
