import { createContext, createElement, useContext, useMemo } from 'react'
import useMethods, { CreateMethods, WrappedMethods } from '../useMethods'
import { Key } from '@/typings/tools'

type MethodsContextValue<S, M extends Record<Key, (...args: any[]) => S>> = [
  S,
  WrappedMethods<S, M>
]

const createMethodsContext = <
  S = {},
  M extends Record<Key, (...args: any[]) => S> = Record<
    Key,
    (...args: any[]) => S
  >
>(
  createMethods: CreateMethods<S, M>,
  defaultInitialValue: S
) => {
  const context = createContext<MethodsContextValue<S, M>>(
    [] as unknown as [S, WrappedMethods<S, M>]
  )
  // 可复用
  const providerFactory = (
    props: React.ProviderProps<MethodsContextValue<S, M>>,
    children: Parameters<typeof createElement>[2]
  ) => createElement(context.Provider, props, children)

  const MethodsProvider: React.FC<{ initialValue?: S }> = ({
    children,
    initialValue
  }) => {
    const stateAndMethods = useMethods(
      createMethods,
      initialValue !== undefined ? initialValue : defaultInitialValue
    )

    const memoContext = useMemo(
      () => ({ value: stateAndMethods }),
      [stateAndMethods]
    )
    return providerFactory(memoContext, children)
  }

  function useMethodsContext() {
    const stateAndMethods = useContext(context)
    if (stateAndMethods === null) {
      throw new Error(
        `useMethodsContext must be used inside a MethodsProvider.`
      )
    }
    return stateAndMethods
  }

  return [useMethodsContext, MethodsProvider, context] as const
}
export type { MethodsContextValue }
export default createMethodsContext
