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
      routerMethods.push(accessRoutes)
    } else {
      routerMethods.reset()
    }
  }, [isLogin])

  useEffect(() => {
    // 初始化请求参数
    initService([authState, authMethods])
  }, [authState, authMethods])

  // 管理登录态
  useEffect(() => {
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
    // 验证 token
    if (!authState.user) {
      return <PageLoading />
    }

    if (noLoginList.includes(pathname)) {
      return <Redirect to="/desktop" />
    }
    return <>{children}</>
  } else {
    if (whiteList.includes(pathname)) {
      return <>{children}</>
    }
    return <Redirect to="/login" />
  }
}
export default Auth
