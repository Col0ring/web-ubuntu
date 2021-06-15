import React, { useEffect, useMemo } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { matchRoutes, renderRoutes } from 'react-router-config'
import { useRouterContext } from './provider'

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

  return memoRoutes
}

const RouterHelper: React.FC = () => {
  const [state, methods] = useRouterContext()
  const { routes } = state
  const { pathname } = useLocation()
  useEffect(() => {
    const matchedRoutes = matchRoutes(routes, pathname)
    methods.set(matchedRoutes.map((route) => route.route))
  }, [pathname, methods])
  return null
}

export { AppRoutes, AppRouter }
