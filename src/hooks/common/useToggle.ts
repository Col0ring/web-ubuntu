import { useState, useMemo } from 'react'

type ToggleState = string | number | boolean | undefined

interface useToggleActions<T = ToggleState> {
  setLeft: () => void
  setRight: () => void
  toggle: (value?: T) => void
}

function useToggle<T = boolean | undefined>(): [boolean, useToggleActions<T>]

function useToggle<T = ToggleState>(defaultValue: T): [T, useToggleActions<T>]

function useToggle<T = ToggleState, U = ToggleState>(
  defaultValue: T,
  reverseValue: U
): [T | U, useToggleActions<T | U>]

function useToggle<
  D extends ToggleState = ToggleState,
  R extends ToggleState = ToggleState
>(defaultValue: D = false as D, reverseValue?: R) {
  const [state, setState] = useState<D | R>(defaultValue)

  const actions = useMemo(() => {
    const reverseValueOrigin = (
      reverseValue === undefined ? !defaultValue : reverseValue
    ) as D | R

    // 切换返回值
    const toggle = (value?: D | R) => {
      // 强制返回状态值，适用于点击操作
      if (value !== undefined) {
        setState(value)
        return
      }
      setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue))
    }
    // 设置默认值
    const setLeft = () => setState(defaultValue)
    // 设置取反值
    const setRight = () => setState(reverseValueOrigin)

    return {
      toggle,
      setLeft,
      setRight,
    }
  }, [defaultValue, reverseValue])

  return [state, actions]
}

export type { useToggleActions }

export default useToggle
