import React, { useRef } from 'react'

const SidebarArea: React.FC = () => {
  const SidebarAreaRef = useRef<HTMLDivElement | null>(null)

  return (
    <div
      ref={SidebarAreaRef}
      className="w-1 h-full absolute top-0 left-0 bg-transparent z-50 opacity-0"
    ></div>
  )
}

export default SidebarArea
