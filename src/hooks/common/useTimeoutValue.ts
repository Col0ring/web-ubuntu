import { useEffect, useState } from 'react'
import useTimeoutFn from './useTimeoutFn'

function useTimeoutValue<T>(value: T, ms = 0): T {
  const [state, setState] = useState(value)
  const { run, cancel } = useTimeoutFn((val: T) => {
    setState(val)
  }, ms)
  useEffect(() => {
    cancel()
    run(value)
  }, [cancel, run, value])
  return state
}

export default useTimeoutValue
