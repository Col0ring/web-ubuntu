import { RouteConfig } from 'react-router-config'

export interface RouteConfigProps extends RouteConfig {
  title?: string
  redirect?: string
}

export interface RouterContextValue {
  routes: RouteConfigProps[]
  matchedRoutes: RouteConfigProps[]
}
