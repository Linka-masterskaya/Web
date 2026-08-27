import { FilterAge } from '@features/filter-age'
import { FilterFavorite } from '@features/filter-favorite'
import { FilterLevel } from '@features/filter-level'
import { FilterSearch } from '@features/filter-search'
import { CreateSetButton } from '@pages/student-shelf-page/create-set-button'
import { StudentShelfBreadcrumbs } from '@pages/student-shelf-page/student-shelf-breadcrumbs'
import { AddStudentButton } from '@pages/students-page/add-student-button'
import { ModalAppLayout } from '@shared/lib/modal'
import { routeParams, routerPath, routeSegments } from '@shared/lib/routes'
import { AppLayout } from '@widgets/app-layout'
import { AuthLayoutLeft, AuthLayoutRight } from '@widgets/auth-layout'
import {
  DashboardBreadcrumbs,
  DashboardCreateEntity,
  DashboardLayout,
} from '@widgets/dashboard-layout'
import { ProfileToggleButton } from '@widgets/profile-toggle/profile-toggle'
import { StudioLayout } from '@widgets/studio-layout'
import React, { createElement } from 'react'
import { createBrowserRouter } from 'react-router'
import { requireAuthLoader } from './loaders/require-auth.loader'
import { requireGuestLoader } from './loaders/require-guest.loader'
import { rootRedirectLoader } from './loaders/root-redirect.loader'
import { pageLazyLoad } from './page-lazy-load.util'
import { RouteErrorFallback } from './route-error-fallback'

// Общий хедер разделов: заголовок, поиск + фильтры, избранное и профиль
const createDashboardHeader = () =>
  createElement(AppLayout, {
    titleSlot: 'Библиотека наборов',
    searchSlot: createElement(
      React.Fragment,
      null,
      createElement(FilterSearch),
      createElement(FilterAge),
      createElement(FilterLevel),
    ),
    actionsSlot: createElement(
      React.Fragment,
      null,
      createElement(FilterFavorite),
      createElement(ProfileToggleButton),
    ),
  })

export const router = createBrowserRouter([
  {
    path: '/',
    Component: ModalAppLayout,
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
                  {
                    path: routeSegments.resendVerification,
                    lazy: pageLazyLoad(() => import('@pages/resend-verification-page')),
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        path: routeSegments.verifyEmail,
        Component: AuthLayoutRight,
        children: [
          {
            index: true,
            lazy: pageLazyLoad(() => import('@pages/verify-email-page')),
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
                // Общий хедер дашборда: заголовок, поиск + фильтры, избранное и профиль
                element: createDashboardHeader(),
                children: [
                  {
                    element: createElement(DashboardLayout, {
                      breadcrumbsSlot: createElement(DashboardBreadcrumbs),
                      actionsSlot: createElement(DashboardCreateEntity),
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
                        path: routeSegments.sets,
                        lazy: pageLazyLoad(() => import('@pages/sets-page')),
                      },
                    ],
                  },
                  {
                    // Ученики: кнопка «Добавить ученика» прижата к правому краю панели
                    element: createElement(DashboardLayout, {
                      breadcrumbsSlot: createElement(DashboardBreadcrumbs),
                      actionsSlot: createElement(AddStudentButton),
                    }),
                    children: [
                      {
                        path: routeSegments.students,
                        lazy: pageLazyLoad(() => import('@pages/students-page')),
                      },
                    ],
                  },
                ],
              },
              {
                Component: StudioLayout,
                children: [
                  {
                    path: routeSegments.sets,
                    children: [
                      {
                        path: routeSegments.new,
                        element: 'Страница в разработке',
                      },
                      {
                        path: routeParams.setId,
                        children: [
                          {
                            index: true,
                            lazy: pageLazyLoad(() => import('@pages/set-page')),
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
                                lazy: pageLazyLoad(() => import('@pages/set-subset-new-page')),
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
                                    lazy: pageLazyLoad(() => import('@pages/set-subset-edit-page')),
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
            // Полка ученика: тот же хедер, крошки с именем ученика, кнопка «Создать»
            path: routerPath.studentId,
            element: createDashboardHeader(),
            children: [
              {
                element: createElement(DashboardLayout, {
                  breadcrumbsSlot: createElement(StudentShelfBreadcrumbs),
                  actionsSlot: createElement(CreateSetButton),
                }),
                children: [
                  {
                    index: true,
                    lazy: pageLazyLoad(() => import('@pages/student-shelf-page')),
                  },
                ],
              },
            ],
          },
        ],
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
])
