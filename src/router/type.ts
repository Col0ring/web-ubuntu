import { RouteConfig } from 'react-router-config'
import { CacheOptions } from '@/components/keep-alive'

export interface RouteConfigProps extends RouteConfig {
  title?: string
  redirect?: string
  // if keep alive is turned on, do not use react.lazy
  keepAlive?: CacheOptions
}

export interface RouterContextValue {
  routes: RouteConfigProps[]
  matchedRoutes: RouteConfigProps[]
}
