import { Reducer, useMemo, useReducer } from 'react'
import { Key } from '@/typings/tools'
interface Action<T extends Key> {
  type: T
  payload?: any
}

type CreateMethods<S, M extends Record<Key, (...args: any[]) => S>> = (
  state: S
) => M

type WrappedMethods<S, M extends Record<Key, (...args: any[]) => S>> = {
  [K in keyof M]: (...payload: Parameters<M[K]>) => void
}

function useMethods<S, M extends Record<Key, (...args: any[]) => S>>(
  createMethods: CreateMethods<S, M>,
  initialState: S
): [S, WrappedMethods<S, M>] {
  const reducer: Reducer<S, Action<keyof M>> = useMemo(
    () => (reducerState, action) => {
      return createMethods(reducerState)[action.type](...action.payload)
    },
    [createMethods]
  )
  const actionTypes = useMemo(() => {
    return Object.keys(createMethods(initialState))
  }, [createMethods])

  const [state, dispatch] = useReducer(reducer, initialState)

  const wrappedMethods: WrappedMethods<S, M> = useMemo(() => {
    // 重新生成 methods
    return actionTypes.reduce((methods, type: keyof M) => {
      // type 是 M 的键之一，需要重新注解类型
      methods[type] = (...payload) => dispatch({ type, payload })
      return methods
    }, {} as WrappedMethods<S, M>)
  }, [createMethods, actionTypes])

  return [state, wrappedMethods]
}

export type { Action, CreateMethods, WrappedMethods }
export default useMethods
