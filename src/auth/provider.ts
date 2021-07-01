import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import { UserProps } from '@/typings/user'
import { AuthContextValue } from './type'
import { getToken, removeToken, setToken } from './util'

const initialToken = getToken()

const [useAuthContext, AuthProvider] = createMethodsContext(
  (state) => ({
    async login(token: string) {
      setToken(token)
      return { ...state, token, isLogin: true }
    },
    setUser(user: UserProps) {
      return { ...state, user }
    },
    logout() {
      removeToken()
      return { ...state, user: null, token: null, isLogin: false }
    }
  }),
  {
    user: null,
    token: initialToken,
    isLogin: initialToken ? true : false
  } as AuthContextValue
)

export { AuthProvider, useAuthContext }
