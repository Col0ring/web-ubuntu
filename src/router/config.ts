import Login from '@/pages/login'
import Desktop from '@/pages/desktop'
import { RouteConfigProps } from './type'
import { convertRoutes } from './util'
import React from 'react'

export const accessRoutes: RouteConfigProps[] = convertRoutes([
  {
    title: 'desktop',
    path: '/desktop',
    exact: true,
    component: React.lazy(() => import('@/pages/desktop'))
  },
  {
    redirect: '/desktop'
  }
])

export const constantsRoutes: RouteConfigProps[] = convertRoutes([
  {
    title: 'login',
    path: '/login',
    exact: true,
    component: React.lazy(() => import('@/pages/login'))
  }
])
