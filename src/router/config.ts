import Login from '@/pages/login'
import Desktop from '@/pages/desktop'
import { RouteConfigProps } from './type'
import { convertRoutes } from './util'

export const accessRoutes: RouteConfigProps[] = convertRoutes([
  {
    path: '/desktop',
    exact: true,
    component: Desktop
  },
  {
    redirect: '/desktop'
  }
])

export const constantsRoutes: RouteConfigProps[] = convertRoutes([
  {
    path: '/login',
    exact: true,
    component: Login
  }
])
