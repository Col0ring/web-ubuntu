import React from 'react'
import ReactDOM from 'react-dom'
import { AppRouter, AppRoutes } from '@/router'
import AppProvider from './provider'
import Auth from './auth'
import '@/styles/index.less'

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <AppRouter>
        <Auth>
          <AppRoutes />
        </Auth>
      </AppRouter>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
