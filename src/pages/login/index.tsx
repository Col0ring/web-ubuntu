import React, { useCallback } from 'react'
import useAsyncFn from '@/hooks/common/useAsyncFn'
import cofOrangeHEx from '@/assets/themes/Yaru/status/cof_orange_hex.svg'
import ubuntuWhiteHex from '@/assets/themes/Yaru/status/ubuntu_white_hex.svg'
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

  const onLogin = useCallback(async () => {
    const [, res] = await login({ username: 'admin', password: '123456' })
    if (res) {
      authMethods.login(res.data.token)
    }
  }, [login, authMethods])

  return (
    <div
      className={
        'absolute duration-500 select-none flex flex-col justify-around items-center top-0 right-0 overflow-hidden m-0 p-0 h-screen w-screen bg-black'
      }
    >
      <img className="md:w-1/4 w-1/2" src={cofOrangeHEx} alt="Ubuntu Logo" />

      <LoginButton loading={loading} onClick={onLogin} />

      <img className="md:w-1/5 w-1/2" src={ubuntuWhiteHex} alt="Ubuntu Name" />
      <div className="text-white mb-4">
        <a
          className="underline"
          href="https://www.linkedin.com/in/vivek9patel/"
          rel="noreferrer noopener"
          target="_blank"
        >
          linkedin
        </a>
        <span className="font-bold mx-1">|</span>
        <a
          href="https://github.com/vivek9patel/vivek9patel.github.io"
          rel="noreferrer noopener"
          target="_blank"
          className="underline"
        >
          github
        </a>
      </div>
    </div>
  )
}

export default Login
