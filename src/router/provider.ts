import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import { RouteConfig, RouterContextValue } from './type'
import { constantsRoutes } from './config'

const [useRouterContext, RouterProvider] = createMethodsContext(
  (state) => ({
    pushRoutes(routes: RouteConfig | RouteConfig[]) {
      return {
        ...state,
        routes: [
          ...state.routes,
          ...(Array.isArray(routes) ? routes : [routes]),
        ],
      }
    },
    setMatchedRoutes(matchedRoutes: RouteConfig[], currentRoute: RouteConfig) {
      return { ...state, matchedRoutes, currentRoute }
    },
    reset() {
      return { currentRoute: {}, routes: constantsRoutes, matchedRoutes: [] }
    },
  }),
  {
    routes: constantsRoutes,
    currentRoute: {},
    matchedRoutes: [],
  } as RouterContextValue
)

export { useRouterContext, RouterProvider }
