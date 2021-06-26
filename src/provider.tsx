import React from 'react'
import { RouterProvider } from './router/provider'
import { AuthProvider } from './auth/provider'
import { SettingProvider } from './setting/provider'
import { KeepAliveProvider } from '@/components/keep-alive'

const AppProvider: React.FC = ({ children }) => {
  return (
    <SettingProvider>
      <AuthProvider>
        <KeepAliveProvider>
          <RouterProvider>{children}</RouterProvider>
        </KeepAliveProvider>
      </AuthProvider>
    </SettingProvider>
  )
}

export default AppProvider
