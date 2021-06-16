import React from 'react'
import { useAuthContext } from '@/auth/provider'
import BackgroundImage from './components/background-image'
const Desktop: React.FC = () => {
  const [, methods] = useAuthContext()
  return (
    <div className="h-full w-full flex flex-col items-end justify-start content-start flex-wrap-reverse pt-8 bg-transparent relative overflow-hidden overscroll-none">
      <BackgroundImage type="wall-2" />
      {/* Window Area */}
      <button
        className="ring ring-green-600 ring-offset-4 ring-offset-green-100"
        onClick={() => methods.logout()}
      >
        Logout
      </button>
    </div>
  )
}

export default Desktop
