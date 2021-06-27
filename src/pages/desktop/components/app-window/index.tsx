import React, { useMemo, useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import { getParentNode } from '@/utils/tool'
import Toolbar, { ToolbarProps } from './toolbar'
import MainView from './main-view'
import Transition from '@/components/transition'
import Movable, { MovableProps } from '@/components/movable'
import LazyLoad from '@/components/lazy-load'
import Resizable, { ResizableProps, Direction } from '@/components/resizable'
import { dataTarget, defaultDesktop } from '../../config'
import { OpenedAppConfig } from '@/typings/app'
import './style.less'
import { useDesktopContext } from '../../provider'
import { Percentage } from '@/typings/tools'
import useTimeoutValue from '@/hooks/common/useTimeoutValue'
import { MoveContext } from '@/hooks/common/useDomMove'

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
  const [desktopState, desktopMethods] = useDesktopContext()
  const { defaultAppWindow } = desktopState
  //prevent closure
  const defaultAppWindowRef = useRef(defaultAppWindow)
  defaultAppWindowRef.current = defaultAppWindow
  const [position, setPosition] = useState({
    left: app.position.left || 0,
    top: app.position.top || 0
  })
  const [rect, setRect] = useState({
    width: app.rect.width || 0,
    height: app.rect.height || 0
  })
  const rectRef = useRef(rect)
  rectRef.current = rect

  const isMaximizedTimeout = useTimeoutValue(isMaximized, 300)

  const appWindowRef = useRef<HTMLDivElement | null>(null)
  const appWindowClassName = classnames(
    'm-auto overflow-hidden max-w-full max-h-full absolute window-shadow border-black border-opacity-40 border border-t-0 bg-ub-window-title',
    isMaximized ? 'z-60 rounded-none' : 'rounded-lg rounded-b-none',
    {
      'not-focus': !isFocus,
      'z-10 not-focus': !isFocus && !isMaximized,
      'z-30': isFocus && !isMaximized,
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
        // if (left < 0) {
        //   left = 1
        // }

        // if (left > window.innerWidth - width) {
        //   left = window.innerWidth - width
        // }

        // if (top > window.innerHeight - height) {
        //   top = window.innerHeight - height
        // }

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
    const width = isMaximized ? '100%' : rect.width || defaultAppWindow.width
    const height = isMaximized ? '100%' : rect.height || defaultAppWindow.height
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
      bottom,
      minWidth: defaultAppWindow.minWidth,
      minHeight: defaultAppWindow.minHeight,
      // set the Resizable to be absolute
      position: 'absolute'
    }
  }, [position, isMaximized, rect, desktopMethods, defaultAppWindow])

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

  const resizeDirectionMethods = useMemo(() => {
    return {
      l: ({ width, offsetX, left }) => {
        if (width - offsetX < defaultAppWindowRef.current.minWidth) {
          return
        }
        setRect((rect) => {
          return {
            width: width - offsetX,
            height: rect.height
          }
        })

        setPosition((position) => {
          return {
            top: position.top,
            left
          }
        })
      },
      r: ({ width, offsetX }) => {
        setRect((rect) => {
          return {
            width: width + offsetX,
            height: rect.height
          }
        })
      },
      t: ({ height, offsetY, top }) => {
        if (height - offsetY < defaultAppWindowRef.current.minHeight) {
          return
        }
        setRect((rect) => {
          return {
            width: rect.width,
            height: height - offsetY
          }
        })

        setPosition((position) => {
          return {
            top,
            left: position.left
          }
        })
      },
      b: ({ height, offsetY }) => {
        setRect((rect) => {
          return {
            width: rect.width,
            height: height + offsetY
          }
        })
      },
      lb: ({ width, left, height, offsetX, offsetY }) => {
        if (width - offsetX < defaultAppWindowRef.current.minWidth) {
          return
        }
        setRect({
          width: width - offsetX,
          height: height + offsetY
        })
        setPosition((position) => {
          return {
            top: position.top,
            left
          }
        })
      },
      rb: ({ width, height, offsetX, offsetY }) => {
        setRect({
          width: width + offsetX,
          height: height + offsetY
        })
      },
      lt: ({ width, height, offsetX, offsetY, top, left }) => {
        if (
          height - offsetY < defaultAppWindowRef.current.minHeight ||
          width - offsetX < defaultAppWindowRef.current.minWidth
        ) {
          return
        }
        setRect({
          width: width - offsetX,
          height: height - offsetY
        })

        setPosition({
          top,
          left
        })
      },
      rt: ({ width, height, offsetX, offsetY, top }) => {
        if (height - offsetY < defaultAppWindowRef.current.minHeight) {
          return
        }
        setRect({
          width: width + offsetX,
          height: height - offsetY
        })

        setPosition((position) => {
          return {
            top,
            left: position.left
          }
        })
      }
    } as Record<Direction, (ctx: MoveContext) => void>
  }, [setRect, rect, setPosition])

  const resizableProps: ResizableProps = useMemo(
    () => ({
      onMoveStart: (e) => {
        const { left, top } = (
          e.currentTarget as HTMLElement
        ).getBoundingClientRect()
        setPosition((position) => {
          if (position.left === left && position.top === top) {
            return position
          }
          return {
            top,
            left
          }
        })
      },
      onMoving: (direction, ctx) => {
        resizeDirectionMethods[direction](ctx)
      }
    }),
    [setRect, setPosition, resizeDirectionMethods]
  )
  return (
    // TODO: close animation
    <Transition
      transitionProperty={['width', 'height', 'left', 'top']}
      nodeRef={appWindowRef}
      // minimize animation
      duration={isMaximized || isMaximizedTimeout ? 300 : 0}
      visible={true}
      exist
    >
      <Resizable
        disabled={isMaximized}
        className={appWindowClassName}
        ref={appWindowRef}
        style={appWindowStyle}
        {...resizableProps}
      >
        <Movable {...movableProps} className="flex flex-col w-full h-full">
          <Toolbar {...ToolbarMethods} title={app.title} />
          <MainView>
            <LazyLoad>
              {typeof app.render === 'function'
                ? app.render()
                : app.component
                ? React.createElement(app.component)
                : null}
            </LazyLoad>
          </MainView>
        </Movable>
      </Resizable>
    </Transition>
  )
}

export default AppWindow
