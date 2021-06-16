import React from 'react'
import { useAuthContext } from '@/auth/provider'
import BackgroundImage from './components/background-image'
import { useDesktopContext, withDesktopProvider } from './provider'
import Navbar from './components/navbar'

const Desktop: React.FC = () => {
  const [, methods] = useAuthContext()
  const [desktopState] = useDesktopContext()
  return (
    <div className="h-full w-full flex flex-col items-end justify-start content-start flex-wrap-reverse pt-8 bg-transparent relative overflow-hidden overscroll-none">
      <BackgroundImage type={desktopState.backgroundImage} />
      <Navbar />
      <button
        className="ring ring-green-600 ring-offset-4 ring-offset-green-100"
        onClick={() => methods.logout()}
      >
        Logout
      </button>
    </div>
  )
}
export default withDesktopProvider(Desktop)
