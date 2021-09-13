import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import App, { AppProps } from '@/components/app'
import { Draggable, DraggableProps } from '@/components/dragging'
import { UbuntuApp } from '@/typings/app'
import { useDesktopContext } from '../../provider'
import { getMousePositionOfDom } from '@/utils/tool'

export interface FolderAppProps extends AppProps {
  folderId: string
}

export interface FolderDragData {
  app: UbuntuApp
  from: string
}

const FolderApp: React.FC<FolderAppProps> = (props) => {
  const [position, setPosition] = useState({
    left: (props.app.position?.left as number) || 0,
    top: (props.app.position?.top as number) || 0,
  })
  const [isRender, setIsRender] = useState(() => {
    return !!(
      props.app.position &&
      (props.app.position.left ?? props.app.position?.top)
    )
  })
  const [, desktopMethods] = useDesktopContext()
  const draggableRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isRender) {
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
  }, [])

  const dragData: FolderDragData = useMemo(() => {
    return {
      from: props.folderId,
      app: props.app,
    }
  }, [props.app, props.folderId])

  const onPositionChange: Required<DraggableProps>['onPositionChange'] =
    useCallback(
      (positionState) => {
        desktopMethods.updateFolderApp({
          from: props.folderId,
          to: props.folderId,
          data: {
            ...props.app,
            position: positionState,
          },
        })
      },
      [props.app, props.folderId]
    )

  const onDragStart: Required<DraggableProps>['onDragStart'] = useCallback(
    (_, e) => {
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
  return (
    <Draggable
      onDragStart={onDragStart}
      nodeRef={draggableRef}
      defaultPosition={position}
      style={{ position: isRender ? 'absolute' : 'relative' }}
      onPositionChange={onPositionChange}
      data={dragData}
    >
      <App {...props} />
    </Draggable>
  )
}

export default FolderApp
