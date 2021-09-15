import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classnames from 'classnames'
import useClickAway from '@/hooks/common/useClickAway'
import useEventListener from '@/hooks/common/useEventListener'
import App, { AppProps } from '@/components/app'
import {
  Draggable,
  DraggableProps,
  useDragContext,
} from '@/components/dragging'
import { AppPositionValue, UbuntuApp } from '@/typings/app'
import { useDesktopContext } from '../../provider'
import { getMousePositionOfDom } from '@/utils/tool'
import Contextmenu, { ContextmenuProps } from '@/components/contextmenu'
import { dataTarget } from '../../config'
import useUpdateEffect from '@/hooks/common/useUpdateEffect'
import { getFolderDragTarget, removeFolderDragTarget } from './store'
import { validMoveFolder } from '../../util'

export interface FolderAppProps extends AppProps {
  folderId: string
}

export interface FolderDragData {
  app: UbuntuApp
  from: string
}

const FolderApp: React.FC<FolderAppProps> = (props) => {
  const [isRender, setIsRender] = useState(() => {
    return !!(
      props.app.position &&
      (props.app.position.left ?? props.app.position.top)
    )
  })
  const [{ appMap }] = useDesktopContext()
  const [{ dragArea }] = useDragContext()
  const [load, setLoad] = useState(false)

  const [isFocus, setIsFocus] = useState(false)
  const isAbsolute = useMemo(
    () => isRender || !!(props.app.position?.left || props.app.position?.top),
    [isRender, props.app.position]
  )
  const draggableRef = useRef<HTMLDivElement | null>(null)
  const draggableClassName = classnames('hover:z-20 focus:z-20 z-10', {
    'z-20': isFocus,
  })
  const [, desktopMethods] = useDesktopContext()

  const dragData: FolderDragData = useMemo(() => {
    return {
      from: props.folderId,
      app: props.app,
    }
  }, [props.app, props.folderId])

  const onDragStart: Required<DraggableProps>['onDragStart'] = useCallback(
    (_, e) => {
      const target = e.currentTarget as HTMLDivElement
      e.dataTransfer.setData(
        'domOffset',
        JSON.stringify({
          ...getMousePositionOfDom(
            { clientX: e.clientX, clientY: e.clientY },
            target
          ),
        })
      )
    },
    []
  )

  const onValid: Required<DraggableProps>['onValid'] = useCallback(() => {
    const toFolderId = getFolderDragTarget()
    removeFolderDragTarget()
    return validMoveFolder(appMap, props.app.id, toFolderId)
  }, [props.app])

  const defaultPosition: {
    left: AppPositionValue
    top: AppPositionValue
  } = useMemo(() => {
    const position = props.app.position || {
      left: 0,
      top: 0,
    }
    return {
      left:
        dragArea.width === 0
          ? position.left
          : typeof position.left === 'string'
          ? position.left
          : `${(position.left / dragArea.width) * 100}%`,
      top:
        dragArea.height === 0
          ? position.top
          : typeof position.top === 'string'
          ? position.top
          : `${(position.top / dragArea.height) * 100}%`,
    }
  }, [props.app.position, dragArea])

  const menus = useMemo(() => {
    return [
      {
        key: 'Copy',
        title: 'Copy',
        disabled: true,
      },
      {
        key: 'Paste',
        title: 'Paste',
        disabled: true,
      },
      // {
      //   key: 'Show Desktop in Files',
      //   title: 'Show Desktop in Files',
      //   disabled: true,
      // },
    ] as ContextmenuProps['menus']
  }, [])

  // only work once
  useUpdateEffect(() => {
    if (draggableRef.current && load && !isRender) {
      const left = draggableRef.current.offsetLeft
      const top = draggableRef.current.offsetTop
      requestAnimationFrame(() => {
        if (draggableRef.current) {
          desktopMethods.updateFolderApp({
            from: props.folderId,
            to: props.folderId,
            data: {
              ...props.app,
              position: {
                left,
                top,
              },
            },
          })
          setIsRender(true)
        }
      })
    }
  }, [load])

  useEffect(() => {
    setLoad(true)
  }, [])

  useClickAway(draggableRef, () => {
    setIsFocus(false)
  })

  useEventListener(draggableRef, 'click', () => {
    desktopMethods.clickApp(props.app.id, props.app)
    setIsFocus(true)
  })

  const onPositionChange: Required<DraggableProps>['onPositionChange'] =
    useCallback(
      (positionState) => {
        if (
          isAbsolute &&
          props.app.position?.left !== positionState.left &&
          props.app.position?.top !== positionState.top
        ) {
          desktopMethods.updateFolderApp({
            from: props.folderId,
            to: props.folderId,
            data: {
              ...props.app,
              position: positionState,
            },
          })
        }
      },
      [props.app, props.folderId, isAbsolute, desktopMethods]
    )
  return (
    <Draggable
      onDragStart={onDragStart}
      nodeRef={draggableRef}
      defaultPosition={defaultPosition}
      onPositionChange={onPositionChange}
      className={draggableClassName}
      data={dragData}
      style={{ position: isAbsolute ? 'absolute' : 'relative' }}
      onValid={onValid}
    >
      <div data-target={dataTarget.folderApp}>
        <Contextmenu menus={menus}>
          <App {...props} />
        </Contextmenu>
      </div>
    </Draggable>
  )
}

export default FolderApp
