import React from 'react'
import useClickAway from './useClickAway'
import useEventListener from './useEventListener'

export interface useContextOptions {
  onClick?: (e: MouseEvent) => void

  onContextMenu?: (e: MouseEvent) => void
  onClickAway?: (e: MouseEvent) => void
}
function useContextmenu(
  ref: React.RefObject<HTMLElement>,
  { onClick, onContextMenu, onClickAway }: useContextOptions = {}
) {
  useEventListener(ref, 'contextmenu', (e) => {
    e.preventDefault()
    onContextMenu?.(e)
  })
  useEventListener(ref, 'click', (e) => {
    e.preventDefault()
    onClick?.(e)
  })
  useClickAway(
    ref,
    (e) => {
      onClickAway?.(e as MouseEvent)
    },
    ['click', 'contextmenu']
  )
}

export default useContextmenu
