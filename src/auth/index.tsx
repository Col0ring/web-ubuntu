import React, { useEffect } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import useAuthContext from '@/hooks/useAuthContext'
import { useRouterContext } from '@/router/provider'
import { accessRoutes } from '@/router/config'
import { initService } from '@/utils/request'
import PageLoading from '@/components/page-loading'
import useAsyncFn from '@/hooks/common/useAsyncFn'
import { reqGetUserInfo } from '@/api/user'

const whiteList = ['/login']

const noLoginList = ['/login']
// 换种方式，看看 react-router-guards
const Auth: React.FC = ({ children }) => {
  const [authState, authMethods] = useAuthContext()
  const [, routerMethods] = useRouterContext()
  const { pathname } = useLocation()
  const [, getUserInfo] = useAsyncFn(reqGetUserInfo, [])
  const { isLogin } = authState
  useEffect(() => {
    if (isLogin) {
      routerMethods.pushRoutes(accessRoutes)
    } else {
      routerMethods.reset()
    }
  }, [isLogin, routerMethods])

  useEffect(() => {
    // 初始化请求参数
    initService([authState, authMethods])
  }, [authState, authMethods])

  // 管理登录态
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      if (authState.isLogin && !authState.user) {
        const [, res] = await getUserInfo()
        if (res) {
          authMethods.setUser(res.data)
        }
        // 如果失败，拦截器自动清空了 token ，这里就先不管了
      }
    })()
  }, [authState, authMethods, getUserInfo])

  if (isLogin) {
    if (noLoginList.includes(pathname)) {
      return <Redirect to="/desktop" />
    }
    return (
      // 这里放 children 是为了先预加载
      <PageLoading loading={!authState.isLogin || !authState.user}>
        {children}
      </PageLoading>
    )
    // // 验证 token
    // if (!authState.user) {
    //   return (
    //     // 这里放 children 是为了先预加载
    //     <PageLoading loading>{children}</PageLoading>
    //   )
    // }

    // return <>{children}</>
  } else {
    if (whiteList.includes(pathname)) {
      return <>{children}</>
    }
    return <Redirect to="/login" />
  }
}
export default Auth
