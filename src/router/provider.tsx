import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import { RouteConfigProps, RouterContextValue } from './type'
import { constantsRoutes } from './config'

const [useRouterContext, RouterProvider] = createMethodsContext(
  (state) => ({
    push(routes: RouteConfigProps | RouteConfigProps[]) {
      return {
        ...state,
        routes: [
          ...state.routes,
          ...(Array.isArray(routes) ? routes : [routes])
        ]
      }
    },
    set(matchedRoutes: RouteConfigProps[]) {
      return { ...state, matchedRoutes }
    },
    reset() {
      return { routes: constantsRoutes, matchedRoutes: [] }
    }
  }),
  {
    routes: constantsRoutes,
    matchedRoutes: []
  } as RouterContextValue
)

export { useRouterContext, RouterProvider }
