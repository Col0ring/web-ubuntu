import { useMemo, useState, useRef, useCallback } from 'react'
import useMountedState from './useMountedState'

interface DropAreaState {
  isHovering: boolean
}

interface DropProps {
  onDragOver: React.DragEventHandler
  onDragEnter: React.DragEventHandler
  onDragLeave: React.DragEventHandler
  onDrop: React.DragEventHandler
  onPaste: React.ClipboardEventHandler
}

interface DropAreaOptions {
  onFiles?: (files: File[], event?: React.DragEvent) => void
  onUri?: (url: string, event?: React.DragEvent) => void
  // 自定义 dom 节点
  onDom?: (content: any, event?: React.DragEvent) => void
  onText?: (text: string, event?: React.ClipboardEvent) => void
}

type DropCallback = (
  dataTransfer: DataTransfer,
  event: React.DragEvent | React.ClipboardEvent
) => void

function getProps(
  callback: DropCallback,
  setIsHovering: (over: boolean) => void
): DropProps {
  return {
    onDragOver: (event) => {
      event.preventDefault()
    },
    onDragEnter: (event) => {
      event.preventDefault()
      setIsHovering(true)
    },
    onDragLeave: () => {
      setIsHovering(false)
    },
    onDrop: (event) => {
      event.preventDefault()
      event.persist()
      setIsHovering(false)
      callback(event.dataTransfer, event)
    },
    onPaste: (event) => {
      event.persist()
      callback(event.clipboardData, event)
    },
  }
}

// TODO: drag file
function useDrop(options: DropAreaOptions = {}): [DropProps, DropAreaState] {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const [isHovering, setIsHovering] = useState(false)

  const isMounted = useMountedState()
  const callback: DropCallback = useCallback(
    (dataTransfer, event) => {
      // uri
      const uri = dataTransfer.getData('text/uri-list')
      const dom = dataTransfer.getData('custom')

      // 自定义
      if (dom && optionsRef.current.onDom) {
        let data = dom
        try {
          data = JSON.parse(dom)
        } catch (e) {
          data = dom
        }
        optionsRef.current.onDom(data, event as React.DragEvent)
        return
      }

      // 链接
      if (uri && optionsRef.current.onUri) {
        optionsRef.current.onUri(uri, event as React.DragEvent)
        return
      }

      // 文件
      if (
        dataTransfer.files &&
        dataTransfer.files.length &&
        optionsRef.current.onFiles
      ) {
        optionsRef.current.onFiles(
          Array.from(dataTransfer.files),
          event as React.DragEvent
        )
        return
      }

      // 文字
      if (
        dataTransfer.items &&
        dataTransfer.items.length &&
        optionsRef.current.onText
      ) {
        // 拿到 text
        dataTransfer.items[0].getAsString((text) => {
          isMounted() &&
            optionsRef.current.onText!(text, event as React.ClipboardEvent)
        })
      }
    },
    [isMounted]
  )

  const props: DropProps = useMemo(
    () => getProps(callback, setIsHovering),
    [callback, setIsHovering]
  )

  return [props, { isHovering }]
}

export type { DropAreaOptions, DropAreaState, DropProps, DropCallback }

export default useDrop
