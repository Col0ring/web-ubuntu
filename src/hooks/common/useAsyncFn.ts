import React, { useCallback, useMemo, useRef, useState } from 'react'
import useMountedState from './useMountedState'
import { AsyncFunction } from '@/typings/tools'

interface AsyncState<T> {
  loading: boolean
  err: any
  data?: T
}

type AsyncResult<R> = [err: any, data: R | null]

type UseAsyncFnReturn<P extends any[], R> = [
  AsyncState<R>,
  AsyncFunction<P, AsyncResult<R>>
]

function useAsyncFn<P extends any[] = any[], R = any>(
  asyncFn: AsyncFunction<P, R>,
  deps: React.DependencyList = [],
  initialState: Partial<AsyncState<R>> = {}
): UseAsyncFnReturn<P, R> {
  const defaultState: AsyncState<R> = useMemo(
    () => ({
      loading: initialState.loading || false,
      err: initialState.err || null,
      data: undefined
    }),
    []
  )
  // fetch count
  const countRef = useRef(0)
  const isMounted = useMountedState()
  const [state, setState] = useState(defaultState)

  const callbackFn: AsyncFunction<P, AsyncResult<R>> = useCallback(
    (...args) => {
      setState((draft) => ({
        ...draft,
        loading: true
      }))
      countRef.current++

      return asyncFn(...args)
        .finally(() => {
          countRef.current--
        })
        .then(
          (value) => {
            countRef.current === 0 &&
              isMounted() &&
              setState((draft) => ({
                ...draft,
                data: value,
                loading: false
              }))
            return [null, value]
          },
          (error) => {
            countRef.current === 0 &&
              isMounted() &&
              setState((draft) => ({
                ...draft,
                err: error,
                loading: false
              }))
            return [error, null]
          }
        )
    },
    deps
  )

  return [state, callbackFn]
}

export type { AsyncState, UseAsyncFnReturn }
export default useAsyncFn
