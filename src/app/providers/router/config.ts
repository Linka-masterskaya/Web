import { ModalAppLayout } from '@shared/lib/modal'
import { routerPath, routeSegments } from '@shared/lib/routes'
import { AuthLayout } from '@widgets/auth-layout'
import { CommonLayout } from '@widgets/common-layout'
import { DashboardLayout } from '@widgets/dashboard-layout'
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
          },

          {
            loader: requireGuestLoader,
            children: [
              {
                path: routeSegments.login,
                Component: AuthLayout,
                children: [
                  {
                    index: true,
                    lazy: pageLazyLoad(() => import('@pages/login-page')),
                  },
                  {
                    path: routeSegments.forgotPassword,
                    lazy: pageLazyLoad(() => import('@pages/forgot-password-page')),
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
                Component: DashboardLayout,
                children: [
                  {
                    index: true,
                    lazy: pageLazyLoad(() => import('@pages/main-page')),
                  },
                ],
              },

              {
                path: routeSegments.profile,
                lazy: pageLazyLoad(() => import('@pages/profile-page')),
              },

              {
                path: routerPath.card, // Wrong use - better use children and routeSegments or routesParams
                Component: DashboardLayout,
                children: [
                  {
                    index: true,
                    lazy: pageLazyLoad(() => import('@pages/product-page')),
                  },
                ],
              },
            ],
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
