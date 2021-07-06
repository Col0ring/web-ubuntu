import { useCallback, useEffect, useRef } from 'react'
import useUnmount from './useUnmount'
import { NormalFunction } from '@/typings/tools'

enum IntervalStatus {
  Free = 'free',
  Pending = 'pending',
  Canceled = 'cancelled',
  Calling = 'calling',
}

interface UseIntervalFnReturn<T extends NormalFunction> {
  currentStatus: () => 'free' | 'pending' | 'cancelled' | 'calling'
  cancel: () => void
  run: (...args: Parameters<T>) => void
}

function useIntervalFn<T extends NormalFunction>(
  handler: T,
  ms = 0
): UseIntervalFnReturn<T> {
  const status = useRef<IntervalStatus>(IntervalStatus.Free)
  const interval = useRef<ReturnType<typeof setInterval>>()
  const callback = useRef(handler)

  const currentStatus = useCallback(() => status.current, [])

  const run = useCallback(
    (...args) => {
      status.current = IntervalStatus.Pending
      interval.current && clearInterval(interval.current)
      interval.current = setInterval(() => {
        status.current = IntervalStatus.Calling
        callback.current(...args)
      }, ms)
    },
    [ms]
  )

  const cancel = useCallback(() => {
    status.current = IntervalStatus.Canceled
    interval.current && clearInterval(interval.current)
  }, [])

  useEffect(() => {
    callback.current = handler
  }, [handler])

  useUnmount(cancel)

  return {
    currentStatus,
    run,
    cancel,
  }
}

export type { UseIntervalFnReturn }
export default useIntervalFn
