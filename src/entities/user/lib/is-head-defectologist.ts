import { type TUserRole, userRole } from '../config/user-role'

/** Главный методист: ему доступно редактирование Библиотеки (публикация, снятие публикации) */
export const isHeadDefectologist = (role: TUserRole | null | undefined): boolean =>
  role === userRole.headDefectologist
