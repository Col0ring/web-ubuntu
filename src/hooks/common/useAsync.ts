import React, { useEffect, useMemo } from 'react'
import { AsyncFunction } from '@/typings/tools'
import useAsyncFn, { AsyncState } from './useAsyncFn'

function useAsync<P extends any[] = [], R = any>(
  asyncFn: AsyncFunction<P, R>,
  deps: React.DependencyList = [],
  initialState: Partial<AsyncState<R>> = {},
  ...args: P
) {
  const defaultState = useMemo(
    () => ({
      loading: true,
      ...initialState,
    }),
    []
  )
  const [state, callbackFn] = useAsyncFn(asyncFn, deps, defaultState)

  useEffect(() => {
    callbackFn(...args)
  }, [callbackFn])

  return state
}
export type { AsyncState }
export default useAsync
