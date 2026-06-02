import { defineRoute } from './utils/define-route'

// Route segments
export const routeSegments = {
  login: 'login',
  forgotPassword: 'forgot-password',
  dashboard: 'dashboard',
  profile: 'profile',
  card: 'card',
} as const

// Route params
export const routeParams = {
  id: ':id',
} as const

// Query params
export const routeQueryParams = {
  query: 'query',
  pageNumber: 'page',
  perPage: 'per_page',
} as const

// Routes
export const routerPath = {
  login: defineRoute([routeSegments.login]),
  forgotPassword: defineRoute([routeSegments.login, routeSegments.forgotPassword]),

  dashboard: defineRoute([routeSegments.dashboard]),

  profile: defineRoute([routeSegments.profile]),

  card: defineRoute([routeSegments.card, routeParams.id]),
}
