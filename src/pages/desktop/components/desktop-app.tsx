import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classnames from 'classnames'
import Draggable, { DraggableProps } from '@/components/draggable'
import App, { AppProps } from '@/components/app'
import { UbuntuApp } from '@/typings/app'
import useClickAway from '@/hooks/common/useClickAway'
import useEventListener from '@/hooks/common/useEventListener'
import useDomRect from '@/hooks/common/useDomRect'
import useUpdateEffect from '@/hooks/common/useUpdateEffect'
import Contextmenu, { ContextmenuProps } from '@/components/contextmenu'
import { dataTarget, defaultDesktop } from '../config'
import { useDesktopContext } from '../provider'

export interface DesktopAppProps extends AppProps {
  app: UbuntuApp
}

// TODO: to be more simple
const DesktopApp: React.FC<DesktopAppProps> = (props) => {
  const [, desktopMethods] = useDesktopContext()
  const draggableRef = useRef<HTMLDivElement | null>(null)
  const [isFocus, setIsFocus] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [rect, setRect] = useState({
    width: 0,
    height: 0,
  })
  const [offset, setOffset] = useState({
    left: 0,
    top: 0,
  })
  const [position, setPosition] = useState({
    left: props.app.position?.left || 0,
    top: props.app.position?.top || 0,
  })
  const draggableClassName = classnames(' hover:z-20 focus:z-20 z-10', {
    // be created
    absolute:
      isRender || !!(props.app.position?.left || props.app.position?.top),
    'z-20': isFocus,
  })
  const domRect = useDomRect(draggableRef, [])

  useUpdateEffect(() => {
    requestAnimationFrame(() => {
      if (draggableRef.current) {
        const { left, top, width, height } =
          draggableRef.current.getBoundingClientRect()
        setPosition({
          left,
          top,
        })
        setRect({
          width,
          height,
        })
        requestAnimationFrame(() => {
          // to force a repaint,
          // eslint-disable-next-line no-unused-expressions
          draggableRef.current!.scrollTop
          setIsRender(true)
        })
      }
    })
  }, [domRect])

  useEffect(() => {
    if (isRender) {
      // when position changed
      desktopMethods.updateFolderApp({
        from: props.app.parentId,
        to: props.app.parentId,
        data: {
          ...props.app,
          position,
        },
      })
    }
  }, [isRender, props.app.position, position])

  useClickAway(draggableRef, () => {
    setIsFocus(false)
  })

  useEventListener(draggableRef, 'click', () => {
    desktopMethods.clickApp(props.app.id, props.app)
    setIsFocus(true)
  })
  const onDragStart: Required<DraggableProps>['onDragStart'] = useCallback(
    (data: UbuntuApp, e) => {
      const { left, top } = (
        e.currentTarget as HTMLDivElement
      ).getBoundingClientRect()
      setOffset({
        left: e.clientX - left,
        top: e.clientY - top,
      })
    },
    []
  )
  const onDragEnd: Required<DraggableProps>['onDragEnd'] = useCallback(
    (data: UbuntuApp, e) => {
      let left = e.clientX - offset.left
      let top = e.clientY - offset.top
      if (left < 0) {
        left = 0
      }
      if (left > window.innerWidth - rect.width) {
        left = window.innerWidth - rect.width
      }

      if (top > window.innerHeight - rect.height) {
        top = window.innerHeight - rect.height
      }

      if (top < defaultDesktop.navbar) {
        top = defaultDesktop.navbar
      }
      setPosition({
        left,
        top,
      })
      desktopMethods.clickApp(data.id, data)
    },
    [setPosition, rect, offset, desktopMethods]
  )

  // preventDefault
  const documentRef = useRef(document)
  useEventListener(documentRef, 'dragover', (e) => {
    e.preventDefault()
  })

  const draggleStyle: React.CSSProperties = useMemo(
    () => ({
      left:
        typeof position.left === 'string'
          ? position.left
          : `${(position.left / window.innerWidth) * 100}%`,
      top:
        typeof position.top === 'string'
          ? position.top
          : `${(position.top / window.innerHeight) * 100}%`,
    }),
    [position]
  )

  const menus = useMemo(() => {
    return [
      {
        key: 'New Folder',
        title: 'New Folder',
      },
      {
        key: 'Paste',
        title: 'Paste',
        disabled: true,
      },
      {
        key: 'Show Desktop in Files',
        title: 'Show Desktop in Files',
        disabled: true,
      },
    ] as ContextmenuProps['menus']
  }, [])

  return (
    <Draggable
      ref={draggableRef}
      style={draggleStyle}
      className={draggableClassName}
      data={props.app}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
    >
      <div data-target={dataTarget.desktopApp}>
        <Contextmenu menus={menus}>
          <App {...props} />
        </Contextmenu>
      </div>
    </Draggable>
  )
}

export default DesktopApp
