import http from 'http'
import { Connect } from 'vite'

type Item<T> = T extends Array<infer U> ? U : never

export type Methods = [
  'all',
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'options',
  'head'
]
export type MethodProps = Item<Methods>

export type MethodsType = MethodProps | `${Uppercase<MethodProps>}`

export interface HandlerResult {
  status?: number
  message?: string
  data?: any
}

export interface HandlerContext {
  body: Record<string, any>
  query: Record<string, string | string[] | undefined>
  params: Record<string, string>
}

export type RouteHandle = (
  ctx: HandlerContext,
  req: Connect.IncomingMessage,
  res: http.ServerResponse
) => Promise<HandlerResult | void> | HandlerResult | void

export type Routes = Record<string, RouteHandle>

export type MockRoutes = Record<
  string,
  {
    handler: RouteHandle
    method: MethodsType
  }
>

export interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any
}
