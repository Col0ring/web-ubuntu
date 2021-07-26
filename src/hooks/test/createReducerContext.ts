import React, {
  createContext,
  createElement,
  useContext,
  useMemo,
  useReducer,
} from 'react'

type ReducerContextValue<R extends React.Reducer<any, any>> =
  | [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>]
  | undefined

function createReducerContext<R extends React.Reducer<any, any>>(
  reducer: R,
  defaultInitialState: React.ReducerState<R>
) {
  const context = createContext<ReducerContextValue<R>>(undefined)
  // 可复用
  const providerFactory = (
    props: React.ProviderProps<ReducerContextValue<R>>,
    children: Parameters<typeof createElement>[2]
  ) => createElement(context.Provider, props, children)

  // Provider Component
  const ReducerProvider: React.FC<{ initialState?: React.ReducerState<R> }> = ({
    children,
    initialState,
  }) => {
    const state = useReducer<R>(
      reducer,
      initialState !== undefined ? initialState : defaultInitialState
    )
    const memoState = useMemo(() => ({ value: state }), [state])
    return providerFactory(memoState, children)
  }

  function useReducerContext() {
    const state = useContext(context)
    if (state === null) {
      throw new Error(
        `useReducerContext must be used inside a ReducerProvider.`
      )
    }
    return state
  }

  return [useReducerContext, ReducerProvider, context] as const
}

export type { ReducerContextValue }
export default createReducerContext
