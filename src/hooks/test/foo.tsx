import React from 'react'
import useMethods from './useMethods'

interface MethodsState {
  count: number
  www: string
}

const createMethods = (state: MethodsState) => {
  return {
    increment() {
      return { ...state, count: state.count + 1 }
    },
    set(current: number) {
      return { ...state, count: current }
    },
    setA() {},
  }
}

const Counter: React.FC = () => {
  const [s, methods] = useMethods(
    (state) => {
      return {
        increment() {
          return { count: state.count + 1, www: '2' }
        },
        set(current: number) {
          return { ...state, count: current }
        },
        setA(a: string) {
          return ({ type, dispatch, payload }) => {
            console.log(payload)
          }
        },
      }
    },
    {
      count: 0,
    } as MethodsState
  )
  return (
    <div>
      {s.count}
      {/* 下面的代码会有完整的类型提示 */}
      <button onClick={methods.increment}>increment</button>
      <button onClick={() => methods.set(0)}>set</button>
    </div>
  )
}

export default Counter
