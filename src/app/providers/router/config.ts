import { ModalAppLayout } from '@shared/lib/modal'
import { routeParams, routerPath, routeSegments } from '@shared/lib/routes'
import { AuthLayoutLeft, AuthLayoutRight } from '@widgets/auth-layout'
import { CommonLayout } from '@widgets/common-layout'
import { DashboardBreadcrumbs, DashboardLayout } from '@widgets/dashboard-layout'
import { createElement } from 'react'
import { createBrowserRouter } from 'react-router'
import { requireAuthLoader } from './loaders/require-auth.loader'
import { requireGuestLoader } from './loaders/require-guest.loader'
import { rootRedirectLoader } from './loaders/root-redirect.loader'
import { pageLazyLoad } from './page-lazy-load.util'
import { RouteErrorFallback } from './route-error-fallback'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: ModalAppLayout,
    children: [
      {
        Component: CommonLayout,
        errorElement: createElement(RouteErrorFallback),
        children: [
          {
            index: true,
            loader: rootRedirectLoader,
            element: null,
          },

          {
            loader: requireGuestLoader,
            children: [
              {
                path: routeSegments.auth,
                children: [
                  {
                    Component: AuthLayoutRight,
                    children: [
                      {
                        index: true,
                        lazy: pageLazyLoad(() => import('@pages/login-page')),
                      },
                      {
                        path: routeSegments.register,
                        lazy: pageLazyLoad(() => import('@pages/register-page')),
                      },
                      {
                        path: routeSegments.restorePassword,
                        lazy: pageLazyLoad(() => import('@pages/restore-password-page')),
                      },
                    ],
                  },
                  {
                    Component: AuthLayoutLeft,
                    children: [
                      {
                        path: routeSegments.forgotPassword,
                        lazy: pageLazyLoad(() => import('@pages/forgot-password-page')),
                      },
                    ],
                  },
                ],
              },
            ],
          },

          {
            loader: requireAuthLoader,
            children: [
              {
                path: routeSegments.dashboard,
                element: createElement(DashboardLayout, {
                  breadcrumbsSlot: createElement(DashboardBreadcrumbs),
                }),
                children: [
                  {
                    index: true,
                    lazy: pageLazyLoad(() => import('@pages/main-page')),
                  },
                  {
                    path: routeSegments.library,
                    lazy: pageLazyLoad(() => import('@pages/library-page')),
                  },
                  {
                    path: routeSegments.students,
                    lazy: pageLazyLoad(() => import('@pages/students-page')),
                  },
                  {
                    path: routeSegments.sets,
                    children: [
                      {
                        index: true,
                        lazy: pageLazyLoad(() => import('@pages/sets-page')),
                      },
                      {
                        path: routeSegments.new,
                        element: 'Страница в разработке',
                      },
                      {
                        path: routeParams.setId,
                        children: [
                          {
                            index: true,
                            element: 'Страница в разработке',
                          },
                          {
                            path: routeSegments.edit,
                            element: 'Страница в разработке',
                          },
                          {
                            path: routeSegments.subset,
                            children: [
                              {
                                index: true,
                                element: 'Страница в разработке',
                              },
                              {
                                path: routeSegments.new,
                                element: 'Страница в разработке',
                              },
                              {
                                path: routeParams.subsetId,
                                children: [
                                  {
                                    index: true,
                                    element: 'Страница в разработке',
                                  },
                                  {
                                    path: routeSegments.edit,
                                    element: 'Страница в разработке',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          {
            path: routerPath.studentId,
            loader: requireAuthLoader,
            element: 'Страница в разработке',
          },

          {
            path: routerPath.privacyPolicy,
            element: 'Страница в разработке',
          },

          {
            path: '*',
            lazy: pageLazyLoad(() => import('@pages/not-found-page')),
          },
        ],
      },
    ],
  },
])
