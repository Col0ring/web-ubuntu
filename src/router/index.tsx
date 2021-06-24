import React, { useEffect, useMemo } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { matchRoutes, renderRoutes } from 'react-router-config'
import { useRouterContext } from './provider'
import { useSettingContext } from '@/setting/provider'
import LazyLoad from '@/components/lazy-load'
import Loading from '@/components/loading'

const AppRouter: React.FC = ({ children }) => {
  return (
    <BrowserRouter>
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
    <LazyLoad fallback={<Loading loading loadingClassName="bg-black" />}>
      {memoRoutes}
    </LazyLoad>
  )
}

const RouterHelper: React.FC = () => {
  const [routerState, RouterMethods] = useRouterContext()
  const [, settingMethods] = useSettingContext()
  const { routes } = routerState
  const { pathname } = useLocation()
  useEffect(() => {
    const matchedRoutes = matchRoutes(routes, pathname).map(
      (route) => route.route
    )
    RouterMethods.setMatchedRoutes(matchedRoutes)
    const title = matchedRoutes[matchedRoutes.length - 1]?.title
    title && settingMethods.setTitle(title)
  }, [pathname, routes, RouterMethods])
  return null
}

export { AppRoutes, AppRouter }
