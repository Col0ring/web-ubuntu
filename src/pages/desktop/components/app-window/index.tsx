import React, { useMemo, useState } from 'react'
import classnames from 'classnames'
import { getParentNode } from '@/utils/tool'
import Toolbar from './toolbar'
import MainView from './main-view'
import Movable, { MovableProps } from '@/components/movable'
import Vscode from '../../apps/vscode'
import { defaultWindowRect, defaultDesktop, dataTarget } from '../../config'
import { OpenedAppConfig } from '@/typings/app'
import './style.less'

export interface AppWindowProps {
  app: OpenedAppConfig
  className?: string
  style?: React.CSSProperties
  isFocus?: boolean
  isMaximized?: boolean
  isMinimized?: boolean
}

const AppWindow: React.FC<AppWindowProps> = ({
  className,
  style,
  isMaximized,
  isMinimized,
  isFocus
}) => {
  const [position, setPosition] = useState({
    left: style?.left || 0,
    top: style?.top || 0
  })

  const appWindowClassName = classnames(
    'm-auto overflow-hidden max-w-full min-w-1/4 min-h-1/4  absolute window-shadow border-black border-opacity-40 border border-t-0 flex flex-col bg-ub-window-title',
    className,
    isMaximized ? 'duration-300 rounded-none' : 'rounded-lg rounded-b-none',
    isFocus ? 'z-30' : 'z-20 not-focus',
    {
      'opacity-0 invisible duration-200': isMinimized
    }
  )
  const appWindowStyle = useMemo(() => {
    const width =
      window.innerWidth < 800 ? '85%' : style?.width || defaultWindowRect.width
    const height =
      window.innerWidth < 800
        ? '80%'
        : style?.height || defaultWindowRect.height
    return {
      ...style,
      width,
      height,
      left: position.left,
      right: 0,
      top: 0,
      bottom: 0
    }
  }, [style, position])

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
      onMoving: (ctx) => {
        setPosition({
          left: ctx.left,
          top: ctx.top
        })
      }
    }),
    [setPosition]
  )

  return (
    <Movable
      style={appWindowStyle}
      className={appWindowClassName}
      {...movableProps}
    >
      <Toolbar title="About Col0ring" />
      <MainView>
        <Vscode />
      </MainView>
    </Movable>
  )
}

export default AppWindow
