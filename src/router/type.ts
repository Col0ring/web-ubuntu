import { RouteConfig } from 'react-router-config'

export interface RouteConfigProps extends RouteConfig {
  redirect?: string
}

export interface RouterContextValue {
  routes: RouteConfigProps[]
  matchedRoutes: RouteConfigProps[]
}
