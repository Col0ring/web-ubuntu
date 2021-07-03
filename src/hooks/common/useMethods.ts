import { Reducer, useMemo, useReducer, useRef, useState } from 'react'
import { Key } from '@/typings/tools'
import { resolvePromise } from '@/utils/tool'

type CreateMethods<
  S,
  M extends Record<Key, (...args: any[]) => S | Promise<S>>
> = (state: S) => M

type WrappedMethods<
  S,
  M extends Record<Key, (...args: any[]) => S | Promise<S>>
> = {
  [K in keyof M]: (...payload: Parameters<M[K]>) => void
}

function useMethods<
  S,
  M extends Record<Key, (...args: any[]) => S | Promise<S>>
>(
  createMethods: CreateMethods<S, M>,
  initialState: S
): [S, WrappedMethods<S, M>] {
  const actionTypes = useMemo(() => {
    return Object.keys(createMethods(initialState))
  }, [createMethods])

  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)

  const wrappedMethods: WrappedMethods<S, M> = useMemo(() => {
    // 重新生成 methods
    return actionTypes.reduce((methods, type: keyof M) => {
      // type 是 M 的键之一，需要重新注解类型
      methods[type] = (...payload) => {
        const newState = createMethods(stateRef.current)[type](...payload)
        if (newState instanceof Promise) {
          resolvePromise(newState).then((res) => {
            setState(res)
            stateRef.current = res
          })
        } else {
          setState(newState)
          stateRef.current = newState
        }
      }
      return methods
    }, {} as WrappedMethods<S, M>)
  }, [createMethods, actionTypes])
  return [state, wrappedMethods]
}

export type { CreateMethods, WrappedMethods }
export default useMethods
