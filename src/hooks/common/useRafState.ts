import { useCallback, useRef, useState } from 'react'
import useUnmount from './useUnmount'

function useRafState<S>(initialState: S | (() => S)) {
  const frame = useRef(0)
  const [state, setState] = useState(initialState)

  const setRafState: typeof setState = useCallback((value) => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      setState(value)
    })
  }, [])

  useUnmount(() => {
    cancelAnimationFrame(frame.current)
  })

  return [state, setRafState] as const
}

export default useRafState
