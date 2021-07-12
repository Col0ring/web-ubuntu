import React, { useEffect, useRef, useState } from 'react'
import App, { AppProps } from '@/components/app'
import { Draggable } from '@/components/dragging'

export type FolderAppProps = AppProps
const FolderApp: React.FC<FolderAppProps> = (props) => {
  const [isRender, setIsRender] = useState(false)
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
  })
  const draggableRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
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
  }, [])

  return (
    <Draggable
      nodeRef={draggableRef}
      defaultPosition={position}
      style={{ position: isRender ? 'absolute' : 'relative' }}
      data={props.app}
    >
      <App {...props} />
    </Draggable>
  )
}

export default FolderApp
