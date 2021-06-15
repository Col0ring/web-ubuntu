import React from 'react'
import { useAuthContext } from '@/auth/provider'
const Desktop: React.FC = () => {
  const [, methods] = useAuthContext()
  return (
    <div>
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
