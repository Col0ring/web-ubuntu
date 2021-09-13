import { ApiResponse } from '@/typings/request'
import { UserProps } from '@/typings/user'
import request from '@/utils/request'

export function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

// export function reqLogin(options: {
//   username: string
//   password: string
// }): ApiResponse<{
//   token: string
// }> {
//   return request({
//     url: '/user/login',
//     method: 'post',
//     data: options,
//   })
// }
export async function reqLogin(options: {
  username: string
  password: string
}) {
  return {
    data: {
      token: 'this is a token',
    },
  }
}

// export function reqGetUserInfo(): ApiResponse<UserProps> {
//   return request({
//     url: '/user/getUserInfo',
//     method: 'get',
//   })
// }

export async function reqGetUserInfo() {
  await wait(1000)
  return {
    data: {
      username: 'Col0ring',
      email: 'xylCol0ring@gmail.com',
    },
  }
}
