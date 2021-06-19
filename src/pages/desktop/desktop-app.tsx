import React, { useCallback, useRef, useState } from 'react'
import classnames from 'classnames'
import Draggable, { DraggableProps } from '@/components/draggable'
import App, { AppProps } from '@/components/app'
import { AppConfig } from '@/typings/app'
import useClickAway from '@/hooks/common/useClickAway'
import useEventListener from '@/hooks/common/useEventListener'
import useDomRect from '@/hooks/common/useDomRect'
import useUpdateEffect from '@/hooks/common/useUpdateEffect'

export interface DesktopAppProps extends AppProps {}

const DesktopApp: React.FC<DesktopAppProps> = (props) => {
  const draggableRef = useRef<HTMLDivElement | null>(null)
  const [isFocus, setIsFocus] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [rect, setRect] = useState({
    width: 0,
    height: 0
  })
  const [position, setPosition] = useState({
    left: 0,
    top: 0
  })
  const draggableClassName = classnames(' hover:z-20 focus:z-20 z-10', {
    absolute: isRender,
    'z-20': isFocus
  })
  const domRect = useDomRect(draggableRef, [])

  useUpdateEffect(() => {
    if (draggableRef.current) {
      const domRect = draggableRef.current.getBoundingClientRect()
      setPosition({
        left: domRect.left,
        top: domRect.top
      })
      setRect({
        width: domRect.width,
        height: domRect.height
      })
      requestAnimationFrame(() => {
        setIsRender(true)
      })
    }
  }, [domRect])

  useClickAway(draggableRef, () => {
    setIsFocus(false)
  })

  useEventListener(draggableRef, 'click', () => {
    setIsFocus(true)
  })

  const onDragEnd: Required<DraggableProps>['onDragEnd'] = useCallback(
    (data: AppConfig, e) => {
      let left = e.clientX - rect.width / 2
      let top = e.clientY - rect.height / 2
      if (left < 0) {
        left = 0
      }
      if (left > window.innerWidth - rect.width) {
        left = window.innerWidth - rect.width
      }

      if (top > window.innerHeight - rect.height) {
        top = window.innerHeight - rect.width
      }

      if (top < 0) {
        top = 0
      }
      setPosition({
        left,
        top
      })
    },
    [setPosition, rect]
  )

  // preventDefault
  const documentRef = useRef(document)
  useEventListener(documentRef, 'dragover', (e) => {
    e.preventDefault()
  })

  return (
    <Draggable
      ref={draggableRef}
      style={{ left: position.left, top: position.top }}
      className={draggableClassName}
      data={props.app}
      onDragEnd={onDragEnd}
    >
      <App {...props} />
    </Draggable>
  )
}

export default DesktopApp
