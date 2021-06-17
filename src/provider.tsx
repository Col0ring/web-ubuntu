import React from 'react'
import { RouterProvider } from './router/provider'
import { AuthProvider } from './auth/provider'
import { SettingProvider } from './setting/provider'
const AppProvider: React.FC = ({ children }) => {
  return (
    <SettingProvider>
      <AuthProvider>
        <RouterProvider>{children}</RouterProvider>
      </AuthProvider>
    </SettingProvider>
  )
}

export default AppProvider
