import { ApiResponse } from '@/typings/request'
import { UserProps } from '@/typings/user'
import request from '@/utils/request'

export function reqLogin(options: {
  username: string
  password: string
}): ApiResponse<{
  token: string
}> {
  return request({
    url: '/user/login',
    method: 'post',
    data: options
  })
}

export function reqGetUserInfo(): ApiResponse<UserProps> {
  return request({
    url: '/user/getUserInfo',
    method: 'get'
  })
}
