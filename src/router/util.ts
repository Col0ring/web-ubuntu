import React from 'react'
import { Redirect } from 'react-router-dom'
import { RouteConfigProps } from './type'

export function convertRoutes(routes: RouteConfigProps[]): RouteConfigProps[] {
  return routes.map((oldRoute) => {
    const route = { ...oldRoute }
    if (route.redirect) {
      route.render = () => {
        return React.createElement(Redirect, {
          to: route.redirect!
        })
      }
    }
    if (route.routes) {
      route.routes = convertRoutes(route.routes)
    }
    return route
  })
}
