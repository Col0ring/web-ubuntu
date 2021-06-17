import useHover from '@/hooks/common/useHover'
import React, { useRef } from 'react'

export interface SidebarAreaProps {
  onEnter?: () => void
  onLeave?: () => void
}

const SidebarArea: React.FC<SidebarAreaProps> = ({ onEnter, onLeave }) => {
  const SidebarAreaRef = useRef<HTMLDivElement | null>(null)

  useHover(SidebarAreaRef, {
    onEnter,
    onLeave
  })

  return (
    <div
      ref={SidebarAreaRef}
      className="w-1 h-full absolute top-0 left-0 bg-transparent z-50 opacity-0"
    ></div>
  )
}

export default SidebarArea
