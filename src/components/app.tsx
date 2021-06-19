import React, { useCallback } from 'react'
import classnames from 'classnames'
import { AppConfig } from '@/typings/app'

export interface AppProps {
  app: AppConfig
  onOpen?: (id: string, app: AppConfig) => void
  className?: string
}

const App: React.FC<AppProps> = ({ className, app, onOpen }) => {
  const appClassNames = classnames(
    'p-1 m-px z-10 bg-white bg-opacity-0 hover:bg-opacity-20 focus:bg-ub-orange focus:bg-opacity-50 focus:border-yellow-700 focus:border-opacity-100 border border-transparent outline-none rounded select-none w-24 flex flex-col  items-center text-center text-xs font-normal text-white',
    className
  )
  const onAppDoubleClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      onOpen?.(app.id, app)
    }, [onOpen, app.id, app])

  const onAppFocusKeyPress: React.KeyboardEventHandler<HTMLDivElement> =
    useCallback(
      (e) => {
        if (e.key === 'Enter') {
          onOpen?.(app.id, app)
        }
      },
      [onOpen, app.id, app]
    )
  return (
    <div
      // focus
      tabIndex={0}
      className={appClassNames}
      onDoubleClick={onAppDoubleClick}
      onKeyPress={onAppFocusKeyPress}
    >
      <img className="mb-1 w-10" src={app.icon} alt={app.title} />
      <span className="mt-1">{app.title}</span>
    </div>
  )
}

export default App
