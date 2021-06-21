import React, { useMemo, useState } from 'react'
import classnames from 'classnames'
import { getParentNode } from '@/utils/tool'
import Toolbar from './toolbar'
import MainView from './main-view'
import Movable, { MovableProps } from '@/components/movable'
import Vscode from '../../apps/vscode'
import { defaultWindowRect, dataTarget, defaultDesktop } from '../../config'
import { OpenedAppConfig } from '@/typings/app'
import './style.less'

export interface AppWindowProps {
  app: OpenedAppConfig
  isFocus?: boolean
  isMaximized?: boolean
  isMinimized?: boolean
}

const AppWindow: React.FC<AppWindowProps> = ({
  app,
  isMaximized,
  isMinimized,
  isFocus
}) => {
  const [position, setPosition] = useState({
    left: app.position.left || 0,
    top: app.position.top || 0
  })

  const appWindowClassName = classnames(
    'm-auto overflow-hidden max-w-full min-w-1/4 min-h-1/4  absolute window-shadow border-black border-opacity-40 border border-t-0 flex flex-col bg-ub-window-title',
    isMaximized ? 'duration-300 rounded-none' : 'rounded-lg rounded-b-none',
    isFocus ? 'z-30' : 'z-20 not-focus',
    {
      'opacity-0 invisible duration-200': isMinimized
    }
  )

  const movableProps: MovableProps = useMemo(
    () => ({
      filterMoving: (e) => {
        const target = e.target as HTMLDivElement
        return (
          !!getParentNode(target, (node) => {
            // match toolbar
            return (
              (node as HTMLDivElement).dataset?.target === dataTarget.toolbar
            )
          }) &&
          // not edit-buttons
          !getParentNode(target, (node) => {
            return (
              (node as HTMLDivElement).dataset?.target ===
              dataTarget.editButtons
            )
          })
        )
      },
      onMoving: ({ left, top, width, height }) => {
        if (left < 0) {
          left = 1
        }
        if (left > window.innerWidth - width) {
          left = window.innerWidth - width
        }

        if (top > window.innerHeight - height) {
          top = window.innerHeight - height
        }

        if (top < defaultDesktop.navbar) {
          top = defaultDesktop.navbar + 1
        }
        setPosition({
          left,
          top
        })
      }
    }),
    [setPosition]
  )
  const appWindowStyle = useMemo(() => {
    const width = app.rect.width || defaultWindowRect.width
    const height = app.rect.height || defaultWindowRect.height
    return {
      width,
      height,
      left:
        typeof position.left === 'number'
          ? (position.left / window.innerWidth) * 100 + '%'
          : position.left,
      right: position.left ? undefined : 0,
      top:
        typeof position.top === 'number'
          ? (position.top / window.innerHeight) * 100 + '%'
          : position.top,
      bottom: position.top ? undefined : 0
    }
  }, [position, app])

  return (
    <Movable
      style={appWindowStyle}
      className={appWindowClassName}
      {...movableProps}
    >
      <Toolbar title="About Col0ring" />
      <MainView>{/* <Vscode /> */}</MainView>
    </Movable>
  )
}

export default AppWindow
