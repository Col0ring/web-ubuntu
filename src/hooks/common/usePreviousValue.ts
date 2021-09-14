import { useRef, useMemo } from 'react'

type compareFunction<T> = (prev: T | undefined, next: T) => boolean

function usePreviousValue<T>(
  state: T,
  compare?: compareFunction<T>
): T | undefined {
  const prevRef = useRef<T>()
  const curRef = useRef<T>()
  const needUpdate = useMemo(
    () =>
      typeof compare === 'function' ? compare(prevRef.current, state) : true,
    [compare, state]
  )
  if (needUpdate && curRef.current !== state) {
    prevRef.current = curRef.current
  }

  curRef.current = state

  return prevRef.current
}

export type { compareFunction }
export default usePreviousValue
