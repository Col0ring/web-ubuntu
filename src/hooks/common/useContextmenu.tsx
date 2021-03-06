import { DomElement, DomParam } from '@/typings/tools'
import useClickAway from './useClickAway'
import useEventListener from './useEventListener'

export interface useContextmenuOptions {
  onClick?: (e: MouseEvent) => void
  onContextMenu?: (e: MouseEvent) => void
  onClickAway?: (e: MouseEvent) => void
}
function useContextmenu(
  ref: DomParam<Exclude<DomElement, Window>>,
  { onClick, onContextMenu, onClickAway }: useContextmenuOptions = {}
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
