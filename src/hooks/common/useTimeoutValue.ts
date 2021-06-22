import { useEffect, useState } from 'react'
import useTimeoutFn from './useTimeoutFn'
function useTimeoutValue<T>(value: T, ms: number = 0): T {
  const [state, setState] = useState(value)
  const { run, cancel } = useTimeoutFn((val: T) => {
    setState(val)
  }, ms)
  useEffect(() => {
    cancel()
    run(value)
  }),
    [value]
  return state
}

export default useTimeoutValue
