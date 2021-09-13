import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classnames from 'classnames'
import { DraggableProps, Draggable } from '@/components/dragging'
import App, { AppProps } from '@/components/app'
import { AppPositionValue, UbuntuApp } from '@/typings/app'
import useClickAway from '@/hooks/common/useClickAway'
import useEventListener from '@/hooks/common/useEventListener'
import useDomRect from '@/hooks/common/useDomRect'
import useUpdateEffect from '@/hooks/common/useUpdateEffect'
import Contextmenu, { ContextmenuProps } from '@/components/contextmenu'
import { dataTarget } from '../config'
import { useDesktopContext } from '../provider'
import { SpecialFolder } from '../constants'
import { FolderDragData } from '../apps/folder/folder-app'
import { getMousePositionOfDom } from '@/utils/tool'

export interface DesktopAppProps extends AppProps {
  app: UbuntuApp
}

// TODO: to be more simple
const DesktopApp: React.FC<DesktopAppProps> = (props) => {
  const [, desktopMethods] = useDesktopContext()
  const draggableRef = useRef<HTMLDivElement | null>(null)
  const [isFocus, setIsFocus] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [position, setPosition] = useState({
    left: props.app.position?.left || 0,
    top: props.app.position?.top || 0,
  })
  const isAbsolute = useMemo(
    () => isRender || !!(props.app.position?.left || props.app.position?.top),
    [isRender, props.app.position]
  )
  const draggableClassName = classnames('hover:z-20 focus:z-20 z-10', {
    'z-20': isFocus,
  })
  const domRect = useDomRect(draggableRef, [])

  useUpdateEffect(() => {
    if (draggableRef.current && !isRender) {
      requestAnimationFrame(() => {
        if (draggableRef.current) {
          const left = draggableRef.current.offsetLeft
          const top = draggableRef.current.offsetTop
          setPosition({
            left,
            top,
          })
          requestAnimationFrame(() => {
            // to force a repaint,
            // eslint-disable-next-line no-unused-expressions
            draggableRef.current!.scrollTop
            setIsRender(true)
          })
        }
      })
    }
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
    (data, e) => {
      const target = e.currentTarget as HTMLDivElement
      e.dataTransfer.setData(
        'domOffset',
        JSON.stringify(
          getMousePositionOfDom(
            { clientX: e.clientX, clientY: e.clientY },
            target
          )
        )
      )
    },
    []
  )

  // preventDefault
  const documentRef = useRef(document)
  useEventListener(documentRef, 'dragover', (e) => {
    e.preventDefault()
  })

  const defaultPosition: {
    left: AppPositionValue
    top: AppPositionValue
  } = useMemo(
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

  const dragData: FolderDragData = useMemo(() => {
    return {
      from: SpecialFolder.Desktop,
      app: props.app,
    }
  }, [props.app])
  return (
    <Draggable
      nodeRef={draggableRef}
      style={{ position: isAbsolute ? 'absolute' : 'relative' }}
      className={draggableClassName}
      data={dragData}
      defaultPosition={defaultPosition}
      // onDragEnd={onDragEnd}
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
