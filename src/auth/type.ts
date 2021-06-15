import { UserProps } from '@/typings/user'

export interface AuthContextValue {
  user: UserProps | null
  isLogin: boolean
  token: string | null
}
