import React from 'react'
import ReactDOM from 'react-dom'
import { AppRouter, AppRoutes } from '@/router'
import AppProvider from '@/provider'
import Auth from '@/auth'
import Setting from '@/setting'
import '@/styles/index.less'
import { ErrorBoundary } from './components/error-bondary'

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <Setting>
          <AppRouter>
            <Auth>
              <AppRoutes />
            </Auth>
          </AppRouter>
        </Setting>
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
)
