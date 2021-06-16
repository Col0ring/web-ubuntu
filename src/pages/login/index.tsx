import React, { useCallback } from 'react'
import useAsyncFn from '@/hooks/common/useAsyncFn'
import { reqLogin } from '@/api/user'
import { useAuthContext } from '@/auth/provider'
import LoginButton from './components/login-button'
/**
 *
 * TODO: ShutDown can be keepalive the desktop
 */
const Login: React.FC = () => {
  const [{ loading }, login] = useAsyncFn(reqLogin, [])
  const [, authMethods] = useAuthContext()

  /**
   * TODO: use login form
   */
  const onLogin = useCallback(async () => {
    const [, res] = await login({ username: 'admin', password: '123456' })
    if (res) {
      authMethods.login(res.data.token)
    }
  }, [login, authMethods])

  return (
    <div
      className={
        'duration-500  select-none flex flex-col justify-around items-center top-0 right-0 overflow-hidden m-0 p-0 h-full w-full bg-black'
      }
    >
      <img
        className="md:w-1/4 w-1/2"
        src="/themes/Yaru/status/cof_orange_hex.svg"
        alt="Ubuntu Logo"
      />

      <LoginButton loading={loading} onClick={onLogin} />

      <img
        className="md:w-1/5 w-1/2"
        src="/themes/Yaru/status/ubuntu_white_hex.svg"
        alt="Ubuntu Name"
      />
    </div>
  )
}

export default Login
