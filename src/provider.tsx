import React from 'react'
import { RouterProvider } from './router/provider'
import { AuthProvider } from './auth/provider'

const AppProvider: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <RouterProvider>{children}</RouterProvider>
    </AuthProvider>
  )
}

export default AppProvider
