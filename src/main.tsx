import React from 'react'
import ReactDOM from 'react-dom'
import { AppRouter, AppRoutes } from '@/router'
import AppProvider from '@/provider'
import Auth from '@/auth'
import Setting from '@/setting'
import '@/styles/index.less'

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <Setting>
        <AppRouter>
          <Auth>
            <AppRoutes />
          </Auth>
        </AppRouter>
      </Setting>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
