import { ModalAppLayout } from '@shared/lib/modal'
import { routeParams, routerPath, routeSegments } from '@shared/lib/routes'
import { AuthLayout } from '@widgets/auth-layout'
import { CommonLayout } from '@widgets/common-layout'
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
                Component: AuthLayout,
                children: [
                  {
                    index: true,
                    lazy: pageLazyLoad(() => import('@pages/login-page')),
                  },
                  {
                    path: routeSegments.register,
                    element: 'Страница в разработке',
                  },
                  {
                    path: routeSegments.forgotPassword,
                    lazy: pageLazyLoad(() => import('@pages/forgot-password-page')),
                  },
                  {
                    path: routeSegments.restorePassword,
                    element: 'Страница в разработке',
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
                children: [
                  {
                    index: true,
                    lazy: pageLazyLoad(() => import('@pages/main-page')),
                  },

                  {
                    path: routeSegments.library,
                    element: 'Страница в разработке',
                  },

                  {
                    path: routeSegments.students,
                    element: 'Страница в разработке',
                  },

                  {
                    path: routeSegments.sets,
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
            path: '*',
            lazy: pageLazyLoad(() => import('@pages/not-found-page')),
          },
        ],
      },
    ],
  },
])
