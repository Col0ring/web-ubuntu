import useHover from '@/hooks/common/useHover'
import React, { useRef } from 'react'
import { defaultDesktop } from '../../config'

export interface SidebarAreaProps {
  onEnter?: () => void
  onLeave?: () => void
}

const SidebarArea: React.FC<SidebarAreaProps> = ({
  onEnter,
  onLeave,
  children
}) => {
  const sidebarAreaRef = useRef<HTMLDivElement | null>(null)

  useHover(sidebarAreaRef, {
    onEnter,
    onLeave
  })

  return (
    <div
      ref={sidebarAreaRef}
      style={{ width: defaultDesktop.sidebar }}
      className="h-full absolute top-0 right-0  z-40"
    >
      {children}
    </div>
  )
}

export default SidebarArea
