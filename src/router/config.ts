import Desktop from '@/pages/desktop'
import { RouteConfig } from './type'
import React from 'react'

export const accessRoutes: RouteConfig[] = [
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
]

export const constantsRoutes: RouteConfig[] = [
  {
    title: 'login',
    path: '/login',
    exact: true,
    component: React.lazy(() => import('@/pages/login')),
  },
]
