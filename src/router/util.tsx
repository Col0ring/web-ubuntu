import React from 'react'
import {
  Switch,
  SwitchProps,
  matchPath,
  match,
  Router,
  Route,
  Redirect,
} from 'react-router-dom'
import { NormalObject } from '@/typings/tools'
import { KeepAlive } from '@/components/keep-alive'
import { RouteConfig, RouteConfigComponentProps } from './type'
import LazyLoad from '@/components/lazy-load'

const DefaultRenderComponent: React.FC = ({ children }) => {
  return <>{children}</>
}
// expanded from react-router-config
export function renderRoutes(
  routes: RouteConfig[],
  extraProps?: NormalObject,
  switchProps?: SwitchProps
): React.ReactNode {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => {
        if (route.redirect) {
          return <Redirect key={route.key || i} to={route.redirect} />
        }
        return (
          <Route
            key={route.key || i}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={(props) => {
              let children: React.ReactNode
              if (route.routes) {
                children = (
                  <LazyLoad>
                    {renderRoutes(route.routes, extraProps, switchProps)}
                  </LazyLoad>
                )
              }
              const render = () => {
                return route.render
                  ? route.render({
                      ...props,
                      ...extraProps,
                      children,
                      route,
                    })
                  : React.createElement(
                      (route.component as React.ComponentType<RouteConfigComponentProps>) ||
                        DefaultRenderComponent,
                      route.component
                        ? {
                            ...props,
                            ...extraProps,
                            route,
                          }
                        : null,
                      children
                    )
              }
              if (route.keepAlive) {
                return (
                  <KeepAlive
                    {...route.keepAlive}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {render()}
                  </KeepAlive>
                )
              }
              return render()
            }}
          />
        )
      })}
    </Switch>
  ) : null
}

export interface MatchedRoute<
  Params extends { [K in keyof Params]?: string },
  TRouteConfig extends RouteConfig = RouteConfig
> {
  route: TRouteConfig
  match: match<Params>
}

export function matchRoutes<
  Params extends { [K in keyof Params]?: string },
  TRouteConfig extends RouteConfig = RouteConfig
>(
  routes: TRouteConfig[],
  pathname: string
): MatchedRoute<Params, TRouteConfig>[] {
  const branch: MatchedRoute<Params, TRouteConfig>[] = []
  routes.some((route) => {
    const matched = route.path
      ? matchPath(pathname, route)
      : branch.length
      ? branch[branch.length - 1].match // use parent match
      : (Router as Record<string, any>).computeRootMatch(pathname) // use default "root" match

    if (matched) {
      branch.push({ route, match: matched })

      if (route.routes) {
        branch.push(
          ...matchRoutes<Params, TRouteConfig>(
            route.routes as TRouteConfig[],
            pathname
          )
        )
      }
    }

    return matched
  })

  return branch
}
