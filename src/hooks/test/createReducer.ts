import { MutableRefObject, useCallback, useEffect, useRef } from 'react'
import useForceUpdate from './useForceUpdate'

interface AnyAction<T = any> {
  type: T
  [extraProps: string]: any
}

interface Dispatch<A extends AnyAction = AnyAction> {
  <T extends A>(action: T): T
}
interface Store<Action extends AnyAction, State> {
  getState: () => State
  dispatch: Dispatch<Action>
}

type Middleware<Action extends AnyAction, State> = (
  store: Store<Action, State>
) => (next: Dispatch<Action>) => (action: Action) => any

// 合并中间件
function composeMiddleware<Action extends AnyAction, State>(
  chain: Middleware<Action, State>[]
) {
  return (context: Store<Action, State>, dispatch: Dispatch<Action>) => {
    // 先后再前
    return chain.reduceRight((dispatchAction, middleware) => {
      return middleware(context)(dispatchAction)
    }, dispatch)
  }
}

const createReducer = <Action extends AnyAction, State>(
  ...middlewares: Middleware<Action, State>[]
) => {
  // 已经合并后的中间件
  const composedMiddleware = composeMiddleware<Action, State>(middlewares)

  // useReducer
  return (
    reducer: (state: State, action: Action) => State,
    initialState: State,
    initializer = (value: State) => value
  ): [State, Dispatch<Action>] => {
    const ref = useRef(initializer(initialState))
    const forceUpdate = useForceUpdate()
    // dispatch origin
    const dispatch = useCallback(
      <T extends Action>(action: T): T => {
        // 改变 state
        ref.current = reducer(ref.current, action)
        forceUpdate()
        return action
      },
      [reducer, forceUpdate]
    )

    // 真正的 dispatch 对象
    const dispatchRef: MutableRefObject<Dispatch<Action>> = useRef(
      // 向合并后的中间件传入参数
      composedMiddleware(
        {
          getState: () => ref.current,
          dispatch: (action) => dispatchRef.current(action),
        },
        dispatch
      )
    )

    useEffect(() => {
      // dispatch 更新时改变 dispatchRef
      dispatchRef.current = composedMiddleware(
        {
          getState: () => ref.current,
          dispatch: (action) => dispatchRef.current(action),
        },
        dispatch
      )
    }, [dispatch])

    return [ref.current, dispatchRef.current]
  }
}
export type { AnyAction, Dispatch, Store, Middleware }
export default createReducer
