import React from 'react'
import { Redirect } from 'react-router-dom'
import { RouteConfigComponentProps } from 'react-router-config'
import { KeepAlive } from '@/components/keep-alive'
import { RouteConfigProps } from './type'

export function convertRoutes(routes: RouteConfigProps[]): RouteConfigProps[] {
  return routes.map((oldRoute) => {
    const route = { ...oldRoute }
    if (route.redirect) {
      route.render = () => {
        return React.createElement(Redirect, {
          to: route.redirect!,
        })
      }
    }
    if (route.keepAlive) {
      const { render } = route
      const { component } = route
      route.render = (props) => {
        return React.createElement(
          KeepAlive,
          {
            ...route.keepAlive!,
            className: 'w-full h-full',
          },
          render
            ? render(props)
            : component
            ? React.createElement(
                component as React.ComponentType<RouteConfigComponentProps>,
                props
              )
            : null
        )
      }
    }
    if (route.routes) {
      route.routes = convertRoutes(route.routes)
    }
    return route
  })
}
