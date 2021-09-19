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
import { getMousePositionOfDom } from '@/utils/misc'
import Contextmenu, { ContextmenuProps } from '@/components/contextmenu'
import { dataTarget } from '../../config'
import useUpdateEffect from '@/hooks/common/useUpdateEffect'
import { getFolderDragTarget, removeFolderDragTarget } from './store'
import { isFolder, isReplaceFile, isValidFolder } from '../../util'

export interface FolderAppProps extends AppProps {
  folderId: string
}

export interface FolderDragData {
  app: UbuntuApp
  from: string
}

const FolderApp: React.FC<FolderAppProps> = (props) => {
  const renderRef = useRef(
    !!(
      props.app.position &&
      (props.app.position.left || props.app.position.top)
    )
  )
  const [{ appMap, copiedAppId }] = useDesktopContext()
  const [{ dragArea }] = useDragContext()
  const [load, setLoad] = useState(false)

  const [isFocus, setIsFocus] = useState(false)
  const isAbsolute = useMemo(
    () =>
      renderRef.current ||
      !!(props.app.position?.left || props.app.position?.top),
    [props.app.position]
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
    const ids = props.app.id.split('/')
    const currentId = `${toFolderId}/${ids[ids.length - 1]}`
    return (
      isValidFolder(appMap, props.app.id, toFolderId) &&
      !isReplaceFile(appMap, toFolderId, props.app.parentId, currentId)
    )
  }, [props.app, appMap])

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
        key: 'Open',
        title: 'Open',
        onClick: () => {
          desktopMethods.openApp(props.app.id, props.app)
        },
      },
      {
        key: 'Copy',
        title: 'Copy',
        onClick: () => props.onCopy?.(props.app.id, props.app),
      },
      {
        key: 'Paste',
        title: 'Paste',
        disabled:
          !isValidFolder(appMap, copiedAppId, props.app.id) ||
          !isFolder(props.app),
        onClick: () => props.onPaste?.(props.app.id, props.app),
      },
      // {
      //   key: 'Show Desktop in Files',
      //   title: 'Show Desktop in Files',
      //   disabled: true,
      // },
    ] as ContextmenuProps['menus']
  }, [
    props.app,
    appMap,
    props.onCopy,
    copiedAppId,
    props.onPaste,
    desktopMethods,
  ])

  // only work once
  useUpdateEffect(() => {
    if (draggableRef.current && load && !renderRef.current) {
      const left = draggableRef.current.offsetLeft
      const top = draggableRef.current.offsetTop
      requestAnimationFrame(() => {
        renderRef.current = true
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
      style={{ position: isAbsolute ? 'absolute' : 'static' }}
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
