import React, { useEffect, useMemo } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { matchRoutes, renderRoutes } from './util'
import { useRouterContext } from './provider'
import useSettingContext from '@/hooks/useSettingContext'
import LazyLoad from '@/components/lazy-load'
import Loading from '@/components/loading'
import { base } from '@/config'

const AppRouter: React.FC = ({ children }) => {
  return (
    <BrowserRouter basename={base}>
      {children}
      <RouterHelper />
    </BrowserRouter>
  )
}

const AppRoutes: React.FC = () => {
  const [state] = useRouterContext()
  const { routes } = state
  const memoRoutes = useMemo(() => renderRoutes(routes), [routes])

  return (
    // TODO: keep-alive lazy-load
    <LazyLoad fallback={<Loading loading loadingClassName="bg-black" />}>
      {memoRoutes}
    </LazyLoad>
  )
}

const RouterHelper: React.FC = () => {
  const [routerState, routerMethods] = useRouterContext()
  const [, settingMethods] = useSettingContext()
  const { routes } = routerState
  const { pathname } = useLocation()
  useEffect(() => {
    const matchedRoutes = matchRoutes(routes, pathname).map(
      (route) => route.route
    )
    const currentRoute = matchedRoutes[matchedRoutes.length - 1]
    routerMethods.setMatchedRoutes(matchedRoutes, currentRoute)
    const title = currentRoute?.title
    title && settingMethods.setTitle(title)
  }, [pathname, routes, routerMethods, settingMethods])
  return null
}

export { AppRoutes, AppRouter }
