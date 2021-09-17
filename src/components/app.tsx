import React, { useCallback, useRef } from 'react'
import classnames from 'classnames'
import { UbuntuApp } from '@/typings/app'
import useKeyPress from '@/hooks/common/useKeyPress'
import { isMac } from '@/utils/misc'

export interface AppProps {
  app: UbuntuApp
  onCopy?: (id: string, app: UbuntuApp) => void
  onPaste?: (id: string, app: UbuntuApp) => void
  onOpen?: (id: string, app: UbuntuApp) => void
  className?: string
}

const App: React.FC<AppProps> = ({
  className,
  app,
  onOpen,
  onPaste,
  onCopy,
}) => {
  const appClassNames = classnames(
    'p-1 m-px z-10 bg-white bg-opacity-0 hover:bg-opacity-20 focus:bg-ub-orange focus:bg-opacity-50 focus:border-yellow-700 focus:border-opacity-100 border border-transparent outline-none rounded select-none w-24 flex flex-col  items-center text-center text-xs font-normal text-white',
    className
  )
  const appRef = useRef<HTMLDivElement | null>(null)
  const onAppDoubleClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      onOpen?.(app.id, app)
    }, [onOpen, app.id, app])

  useKeyPress(
    'enter',
    () => {
      onOpen?.(app.id, app)
    },
    {
      target: appRef,
    }
  )

  useKeyPress(
    isMac ? 'meta.c' : 'ctrl.c',
    (e) => {
      e.stopPropagation()
      onCopy?.(app.id, app)
    },
    {
      target: appRef,
    }
  )

  useKeyPress(
    isMac ? 'meta.v' : 'ctrl.v',
    (e) => {
      e.stopPropagation()
      onPaste?.(app.id, app)
    },
    {
      target: appRef,
    }
  )

  return (
    <div
      ref={appRef}
      // focus
      tabIndex={0}
      className={appClassNames}
      onDoubleClick={onAppDoubleClick}
    >
      <img className="mb-1 w-10" src={app.icon} alt={app.title} />
      <span className="mt-1">{app.title}</span>
    </div>
  )
}

export default App
