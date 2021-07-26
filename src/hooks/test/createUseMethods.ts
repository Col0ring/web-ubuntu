import { useReducer } from 'react'
import useMethods from './useMethods'
import createReducer, { Middleware, AnyAction } from './createReducer'

const useMethodsFactory = <Action extends AnyAction, State>(
  ...middlewares: Middleware<Action, State>[]
) => {
  const methodsReducer = createReducer(...middlewares) as typeof useReducer

  const useMethodsWrapper: typeof useMethods = (
    createMethods,
    initialState,
    customReducer
  ) => useMethods(createMethods, initialState, customReducer || methodsReducer)
  return useMethodsWrapper
}

export type { Middleware }
export default useMethodsFactory
