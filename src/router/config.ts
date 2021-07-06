import Desktop from '@/pages/desktop'
import { RouteConfigProps } from './type'
import { convertRoutes } from './util'
import React from 'react'

export const accessRoutes: RouteConfigProps[] = convertRoutes([
  {
    title: 'desktop',
    path: '/desktop',
    // if keep alive is turned on, do not use react.lazy
    keepAlive: {
      cacheId: 'desktop-page',
    },
    exact: true,
    component: Desktop,
  },
  {
    redirect: '/desktop',
  },
])

export const constantsRoutes: RouteConfigProps[] = convertRoutes([
  {
    title: 'login',
    path: '/login',
    exact: true,
    component: React.lazy(() => import('@/pages/login')),
  },
])
