import { NormalFunction } from '@/typings/tools'
import { useEffect } from 'react'
import useIntervalFn, { UseIntervalFnReturn } from './useIntervalFn'

type UseIntervalReturn<T extends NormalFunction> = UseIntervalFnReturn<T>

function useInterval<T extends NormalFunction>(
  handler: T,
  ms: number = 0,
  ...args: Parameters<T>
): UseIntervalReturn<T> {
  const context = useIntervalFn(handler, ms)
  useEffect(() => {
    context.run(...args)
  }, [ms])
  return context
}

export type { UseIntervalReturn }
export default useInterval
