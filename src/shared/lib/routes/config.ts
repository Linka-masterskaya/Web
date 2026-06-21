import { defineRoute } from './utils/define-route'

// Route segments
export const routeSegments = {
  auth: 'auth',
  register: 'register',
  forgotPassword: 'forgot-password',
  restorePassword: 'restore-password',
  dashboard: 'dashboard',
  library: 'library',
  students: 'students',
  sets: 'sets',
  new: 'new',
  edit: 'edit',
  subset: 'subset',
  privacyPolicy: 'privacy-policy',
} as const

// Route params
export const routeParams = {
  setId: ':setId',
  subsetId: ':subsetId',
  id: ':id',
} as const

// Query params
export const routeQueryParams = {
  query: 'query',
  pageNumber: 'page',
  perPage: 'per_page',
  search: 'search',
  age: 'age',
  level: 'level',
} as const

// Routes
export const routerPath = {
  auth: defineRoute([routeSegments.auth]),
  authRegister: defineRoute([routeSegments.auth, routeSegments.register]),
  authForgotPassword: defineRoute([routeSegments.auth, routeSegments.forgotPassword]),
  authRestorePassword: defineRoute([routeSegments.auth, routeSegments.restorePassword]),
  dashboard: defineRoute([routeSegments.dashboard]),
  dashboardLibrary: defineRoute([routeSegments.dashboard, routeSegments.library]),
  dashboardStudents: defineRoute([routeSegments.dashboard, routeSegments.students]),
  dashboardSets: defineRoute([routeSegments.dashboard, routeSegments.sets]),
  dashboardSetsNew: defineRoute([routeSegments.dashboard, routeSegments.sets, routeSegments.new]),
  dashboardSetId: defineRoute([routeSegments.dashboard, routeSegments.sets, routeParams.setId]),
  dashboardSetIdEdit: defineRoute([
    routeSegments.dashboard,
    routeSegments.sets,
    routeParams.setId,
    routeSegments.edit,
  ]),
  dashboardSubset: defineRoute([
    routeSegments.dashboard,
    routeSegments.sets,
    routeParams.setId,
    routeSegments.subset,
  ]),
  dashboardSubsetNew: defineRoute([
    routeSegments.dashboard,
    routeSegments.sets,
    routeParams.setId,
    routeSegments.subset,
    routeSegments.new,
  ]),
  dashboardSubsetId: defineRoute([
    routeSegments.dashboard,
    routeSegments.sets,
    routeParams.setId,
    routeSegments.subset,
    routeParams.subsetId,
  ]),
  dashboardSubsetIdEdit: defineRoute([
    routeSegments.dashboard,
    routeSegments.sets,
    routeParams.setId,
    routeSegments.subset,
    routeParams.subsetId,
    routeSegments.edit,
  ]),
  studentId: defineRoute([routeSegments.sets, routeSegments.students, routeParams.id]),
  privacyPolicy: defineRoute([routeSegments.privacyPolicy]),
}
