import { Reducer, useMemo, useReducer, useRef } from 'react'
import { Key } from '@/typings/tools'
import { resolvePromise } from '@/utils/tool'
interface Action<S, T extends Key> {
  type: T
  newState: S
}

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
  const reducer: Reducer<S, Action<S, keyof M>> = useMemo(
    () =>
      (reducerState, { newState }) => {
        // update
        stateRef.current = newState
        return newState
      },
    [createMethods]
  )

  const actionTypes = useMemo(() => {
    return Object.keys(createMethods(initialState))
  }, [createMethods])

  const [state, dispatch] = useReducer(reducer, initialState)
  const dispatchRef = useRef(dispatch)
  const stateRef = useRef(state)
  dispatchRef.current = dispatch

  const wrappedMethods: WrappedMethods<S, M> = useMemo(() => {
    // 重新生成 methods
    return actionTypes.reduce((methods, type: keyof M) => {
      // type 是 M 的键之一，需要重新注解类型
      methods[type] = (...payload) => {
        const newState = createMethods(stateRef.current)[type](...payload)
        if (newState instanceof Promise) {
          resolvePromise(newState).then((res) => {
            dispatchRef.current({ type, newState: res })
          })
        } else {
          dispatchRef.current({ type, newState })
        }
      }
      return methods
    }, {} as WrappedMethods<S, M>)
  }, [createMethods, actionTypes])
  return [state, wrappedMethods]
}

export type { Action, CreateMethods, WrappedMethods }
export default useMethods
