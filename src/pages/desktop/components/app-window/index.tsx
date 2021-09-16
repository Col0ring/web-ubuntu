import React, { useMemo, useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import { getParentNode, percentage2Decimal } from '@/utils/misc'
import Toolbar, { ToolbarProps } from './toolbar'
import MainView from './main-view'
import Transition from '@/components/transition'
import Movable, { MovableProps } from '@/components/movable'
import LazyLoad from '@/components/lazy-load'
import Resizable, { ResizableProps, Direction } from '@/components/resizable'
import { dataTarget, defaultDesktop } from '../../config'
import { OpenedAppConfig } from '@/typings/app'
import { useDesktopContext } from '../../provider'
import { Percentage } from '@/typings/tools'
import useTimeoutValue from '@/hooks/common/useTimeoutValue'
import { MoveContext } from '@/hooks/common/useDomMove'
import './style.less'
import useRafState from '@/hooks/common/useRafState'

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
  isFocus,
}) => {
  const [desktopState, desktopMethods] = useDesktopContext()
  const { defaultAppWindow } = desktopState
  // prevent closure
  const defaultAppWindowRef = useRef(defaultAppWindow)
  defaultAppWindowRef.current = defaultAppWindow
  // raf state
  const [position, setPosition] = useRafState(() => ({
    left: app.windowPosition.left,
    top: app.windowPosition.top,
  }))
  const [rect, setRect] = useRafState(() => ({
    width: app.rect.width,
    height: app.rect.height,
  }))
  const [visible, setVisible] = useState(true)
  const rectRef = useRef(rect)
  rectRef.current = rect

  const isMaximizedTimeout = useTimeoutValue(isMaximized, 300)

  const appWindowRef = useRef<HTMLDivElement | null>(null)
  const appWindowClassName = classnames(
    'm-auto overflow-hidden max-w-full max-h-full absolute window-shadow border-black border-opacity-40 border border-t-0 bg-ub-window-title app-window',
    isMaximized ? 'z-60 rounded-none' : 'rounded-lg rounded-b-none',
    {
      'not-focus': !isFocus,
      'z-20 not-focus': !isFocus && !isMaximized,
      'z-30': isFocus && !isMaximized,
      // hidden: isMinimized
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
      onMoving: ({ left, top }) => {
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
          // eslint-disable-next-line no-param-reassign
          top = defaultDesktop.navbar + 1
        }
        setPosition({
          left,
          top,
        })
      },
      onClick: () => {
        desktopMethods.openApp(app.id, app)
      },
    }),
    [setPosition, defaultDesktop, app, desktopMethods]
  )
  const appWindowStyle: React.CSSProperties = useMemo(() => {
    const width = isMaximized ? '100%' : rect.width || defaultAppWindow.width
    const height = isMaximized ? '100%' : rect.height || defaultAppWindow.height
    const left = isMaximized
      ? 0
      : position.left && typeof position.left === 'number'
      ? `${(position.left / window.innerWidth) * 100}%`
      : position.left
    const top = isMaximized
      ? 0
      : position.top && typeof position.top === 'number'
      ? `${(position.top / window.innerHeight) * 100}%`
      : position.top
    const windowWidth =
      typeof width === 'string'
        ? window.innerWidth * percentage2Decimal(width)
        : width
    const offsetX = (window.innerWidth - windowWidth) / 2
    const windowHeight =
      typeof height === 'string'
        ? window.innerHeight * percentage2Decimal(height)
        : height
    const offsetY = (window.innerHeight - windowHeight) / 2
    const windowPosition =
      left === 0 && top === 0
        ? {
            left: offsetX,
            top: offsetY,
          }
        : {
            left,
            top,
          }

    return {
      width,
      height,
      ...windowPosition,
      minWidth: defaultAppWindow.minWidth,
      minHeight: defaultAppWindow.minHeight,
      // set the Resizable to be absolute
      position: 'absolute',
    }
  }, [position, isMaximized, rect, desktopMethods, defaultAppWindow])

  useEffect(() => {
    if (!isMaximized) {
      desktopMethods.updateOpenedApp(app.id, {
        ...app,
        rect: {
          width: appWindowStyle.width as Percentage,
          height: appWindowStyle.height as Percentage,
        },
        windowPosition: {
          left: appWindowStyle.left as Percentage,
          top: appWindowStyle.top as Percentage,
        },
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
      },
    }),
    [desktopMethods, app]
  )

  const resizeDirectionMethods = useMemo(() => {
    return {
      l: ({ width, offsetX, left }) => {
        if (width - offsetX < defaultAppWindowRef.current.minWidth) {
          return
        }
        setRect((state) => {
          return {
            width: width - offsetX,
            height: state.height,
          }
        })

        setPosition((state) => {
          return {
            top: state.top,
            left,
          }
        })
      },
      r: ({ width, offsetX }) => {
        setRect((state) => {
          return {
            width: width + offsetX,
            height: state.height,
          }
        })
      },
      t: ({ height, offsetY, top }) => {
        if (height - offsetY < defaultAppWindowRef.current.minHeight) {
          return
        }
        setRect((state) => {
          return {
            width: state.width,
            height: height - offsetY,
          }
        })

        setPosition((state) => {
          return {
            top,
            left: state.left,
          }
        })
      },
      b: ({ height, offsetY }) => {
        setRect((state) => {
          return {
            width: state.width,
            height: height + offsetY,
          }
        })
      },
      lb: ({ width, left, height, offsetX, offsetY }) => {
        if (width - offsetX < defaultAppWindowRef.current.minWidth) {
          return
        }
        setRect({
          width: width - offsetX,
          height: height + offsetY,
        })
        setPosition((state) => {
          return {
            top: state.top,
            left,
          }
        })
      },
      rb: ({ width, height, offsetX, offsetY }) => {
        setRect({
          width: width + offsetX,
          height: height + offsetY,
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
          height: height - offsetY,
        })

        setPosition({
          top,
          left,
        })
      },
      rt: ({ width, height, offsetX, offsetY, top }) => {
        if (height - offsetY < defaultAppWindowRef.current.minHeight) {
          return
        }
        setRect({
          width: width + offsetX,
          height: height - offsetY,
        })

        setPosition((state) => {
          return {
            top,
            left: state.left,
          }
        })
      },
    } as Record<Direction, (ctx: MoveContext) => void>
  }, [setRect, rect, setPosition])

  const resizableProps: ResizableProps = useMemo(
    () => ({
      onMoveStart: (e) => {
        const { left, top } = (
          e.currentTarget as HTMLElement
        ).getBoundingClientRect()
        setPosition((state) => {
          if (state.left === left && state.top === top) {
            return state
          }
          return {
            top,
            left,
          }
        })
      },
      onMoving: (direction, ctx) => {
        resizeDirectionMethods[direction](ctx)
      },
    }),
    [setRect, setPosition, resizeDirectionMethods]
  )
  useEffect(() => {
    if (isMinimized) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }, [isMinimized])

  const duration = useMemo(() => {
    if (isMaximized || isMaximizedTimeout) {
      return 300
    }
    // close animation
    if (isMinimized) {
      return 300
    }

    return 0
  }, [isMaximized, isMaximizedTimeout, isMinimized])
  return (
    <Transition
      transitionProperty={['width', 'height', 'left', 'top', 'opacity']}
      nodeRef={appWindowRef}
      enterClassName="app-window-show"
      leaveClassName="app-window-leave"
      // minimize animation
      duration={duration}
      visible={visible}
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
                ? app.render(app.id)
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
