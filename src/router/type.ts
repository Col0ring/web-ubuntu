import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Location } from 'history'
import { CacheOptions } from '@/components/keep-alive'

export interface RouteConfigComponentProps<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Params extends { [K in keyof Params]?: string } = {}
> extends RouteComponentProps<Params> {
  route?: RouteConfig
  children?: React.ReactNode
}
export interface RouteConfig {
  key?: React.Key
  location?: Location
  component?:
    | React.ComponentType<RouteConfigComponentProps<any>>
    | React.ComponentType
  path?: string
  exact?: boolean
  strict?: boolean
  routes?: RouteConfig[]
  render?: (props: RouteConfigComponentProps<any>) => React.ReactNode
  title?: string
  redirect?: string
  // if keep alive is turned on, do not use react.lazy
  keepAlive?: CacheOptions
  lazyLoad?: boolean
  [props: string]: any
}

export interface RouterContextValue {
  routes: RouteConfig[]
  currentRoute: RouteConfig
  matchedRoutes: RouteConfig[]
}
