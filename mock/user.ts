import { wait } from './utils'
import { Routes } from '@col0ring/vite-plugin-mock'

export const prefix = '/user'

const token = 'this is a token'

const userModule: Routes = {
  'post /login': async ({ body }) => {
    await wait(2000)
    if (body.username === 'admin' && body.password === '123456') {
      return {
        data: {
          token,
        },
      }
    }
    return {
      status: 400,
      message: 'username or password is wrong',
    }
  },
  'get /getUserInfo': async (_, req) => {
    await wait(500)
    if (req.headers.token === token) {
      return {
        data: {
          username: 'Col0ring',
          email: 'xylCol0ring@gmail.com',
        },
      }
    }
    return {
      status: 401,
      message: 'token is invalided',
    }
  },
}

export default userModule
