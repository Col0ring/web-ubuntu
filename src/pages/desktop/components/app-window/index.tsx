import React, { useMemo, useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import { getParentNode } from '@/utils/tool'
import Toolbar, { ToolbarProps } from './toolbar'
import MainView from './main-view'
import Transition from '@/components/transition'
import Movable, { MovableProps } from '@/components/movable'
import Vscode from '../../apps/vscode'
import { defaultWindowRect, dataTarget, defaultDesktop } from '../../config'
import { OpenedAppConfig } from '@/typings/app'
import './style.less'
import { useDesktopContext } from '../../provider'
import { Percentage } from '@/typings/tools'
import useTimeoutValue from '@/hooks/common/useTimeoutValue'

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
  const [, desktopMethods] = useDesktopContext()
  const [position, setPosition] = useState({
    left: app.position.left || 0,
    top: app.position.top || 0
  })

  const isMaximizedTimeout = useTimeoutValue(isMaximized, 300)

  const appWindowRef = useRef<HTMLDivElement | null>(null)
  const appWindowClassName = classnames(
    'm-auto overflow-hidden max-w-full min-w-1/4 min-h-1/4  absolute window-shadow border-black border-opacity-40 border border-t-0 flex flex-col bg-ub-window-title',
    isMaximized ? 'z-50 rounded-none' : 'rounded-lg rounded-b-none',
    isFocus ? 'z-50' : 'z-20 not-focus',
    {
      hidden: isMinimized
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
      },
      onClick: () => {
        desktopMethods.openApp(app.id, app)
      }
    }),
    [setPosition, defaultDesktop, app, desktopMethods]
  )
  const appWindowStyle: React.CSSProperties = useMemo(() => {
    const width = isMaximized
      ? '100%'
      : app.rect.width || defaultWindowRect.width
    const height = isMaximized
      ? '100%'
      : app.rect.height || defaultWindowRect.height
    const left = isMaximized
      ? 0
      : typeof position.left === 'number'
      ? (position.left / window.innerWidth) * 100 + '%'
      : position.left
    const right = position.left ? undefined : '0%'
    const top = isMaximized
      ? 0
      : typeof position.top === 'number'
      ? (position.top / window.innerHeight) * 100 + '%'
      : position.top
    const bottom = position.top ? undefined : '0%'
    return {
      width,
      height,
      left,
      top,
      right,
      bottom
    }
  }, [position, isMaximized, app.rect.width, app.rect.height, desktopMethods])

  useEffect(() => {
    if (!isMaximized) {
      desktopMethods.updateOpenedApp(app.id, {
        ...app,
        rect: {
          width: appWindowStyle.width as Percentage,
          height: appWindowStyle.height as Percentage
        },
        position: {
          left: appWindowStyle.left as Percentage,
          top: appWindowStyle.top as Percentage
        }
      })
    }
  }, [appWindowStyle, isMaximized])

  const ToolbarMethods: Pick<
    Required<ToolbarProps>,
    'onMaximize' | 'onClose' | 'onMinimize'
  > = useMemo(
    () => ({
      onClose: () => {
        desktopMethods.closeApp(app.id)
      },
      onMaximize: () => {
        desktopMethods.maximizeApp(app.id, app)
      },
      onMinimize: () => {
        desktopMethods.minimizeApp(app.id, app)
      }
    }),
    [desktopMethods, app]
  )

  return (
    <Transition
      nodeRef={appWindowRef}
      duration={isMaximized || isMaximizedTimeout ? 300 : 0}
      visible={true}
      exist
    >
      <Movable
        ref={appWindowRef}
        style={appWindowStyle}
        className={appWindowClassName}
        {...movableProps}
      >
        <Toolbar {...ToolbarMethods} title={app.title} />
        <MainView>{/* <Vscode /> */}</MainView>
      </Movable>
    </Transition>
  )
}

export default AppWindow
