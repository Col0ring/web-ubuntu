import React, { useRef } from 'react'
import { DomElement } from '../../typings/tools'
import { noop } from '@/utils/tool'
import useEventListener from './useEventListener'

// return true can emit the event
type KeyPredicate = (event: KeyboardEvent) => boolean
// string | number
type keyType = KeyboardEvent['keyCode'] | KeyboardEvent['key']

type KeyFilter = keyType | keyType[] | ((event: KeyboardEvent) => boolean)

type KeyboardEventHandler = (event: KeyboardEvent) => void

type keyEvent = 'keydown' | 'keyup'

interface UseKeyPressOptions {
  event?: keyEvent
  target?: React.RefObject<DomElement>
}

// 键盘事件 keyCode 别名
const aliasKeyCodeMap: Record<string, number | number[]> = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  delete: [8, 46]
}

// 键盘事件 key 别名
const aliasKeyMap: Record<string, string | string[]> = {
  esc: 'Escape',
  tab: 'Tab',
  enter: 'Enter',
  space: ' ',
  // IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  delete: ['Backspace', 'Delete']
}

// 修饰键
const modifierKey: Record<string, KeyPredicate> = {
  ctrl: (event: KeyboardEvent) => event.ctrlKey,
  shift: (event: KeyboardEvent) => event.shiftKey,
  alt: (event: KeyboardEvent) => event.altKey,
  meta: (event: KeyboardEvent) => event.metaKey
}

/**
 * 判断按键是否激活
 * @param [event: KeyboardEvent]键盘事件
 * @param [keyFilter: string | number] 当前键
 * @returns Boolean
 */
function genFilterKey(
  event: KeyboardEvent,
  // keyFilter 过滤后只有 number 和 string 了
  keyFilter: string | number
): boolean {
  // 浏览器自动补全 input 的时候，会触发 keyDown、keyUp 事件，但此时 event.key 等为空
  if (!event.key) {
    return false
  }

  // 数字类型直接匹配事件的 keyCode
  if (typeof keyFilter === 'number') {
    return event.keyCode === keyFilter
  }
  // 字符串依次判断是否有组合键
  const genArr = keyFilter.split('.')

  let genLen = 0
  for (const key of genArr) {
    // 组合键
    const genModifier = modifierKey[key]
    // key 别名
    const aliasKey = aliasKeyMap[key]
    // keyCode 别名
    const aliasKeyCode = aliasKeyCodeMap[key]
    /**
     * 满足以上规则
     * 1. 自定义组合键别名
     * 2. 自定义 key 别名
     * 3. 自定义 keyCode 别名
     * 4. 匹配 key 或 keyCode
     */
    if (
      // 修饰键
      (genModifier && genModifier(event)) ||
      // 别名
      (aliasKey && Array.isArray(aliasKey)
        ? aliasKey.includes(event.key)
        : aliasKey === event.key) ||
      // keyCode 别名
      (aliasKeyCode && Array.isArray(aliasKeyCode)
        ? aliasKeyCode.includes(event.keyCode)
        : aliasKeyCode === event.keyCode) ||
      // key 或者 keyCode 全等
      event.key.toUpperCase() === key.toUpperCase()
    ) {
      genLen++
    }
  }
  // 如果键数正确
  return genLen === genArr.length
}

/**
 * 键盘输入预处理方法
 * @param [keyFilter: KeyFilter] 当前键
 * @returns () => Boolean
 */
function genKeyFormatter(keyFilter: KeyFilter): KeyPredicate {
  // 判断传入当前键的类型
  if (typeof keyFilter === 'function') {
    // 用户自定义过滤器
    return keyFilter
  }
  if (typeof keyFilter === 'string' || typeof keyFilter === 'number') {
    return (event: KeyboardEvent) => genFilterKey(event, keyFilter)
  }
  if (Array.isArray(keyFilter)) {
    return (event: KeyboardEvent) =>
      keyFilter.some((item: number | string) => genFilterKey(event, item))
  }
  return keyFilter ? () => true : () => false
}

const defaultEvents: keyEvent = 'keydown'

function useKeyPress(
  keyFilter: KeyFilter,
  eventHandler: KeyboardEventHandler = noop,
  option: UseKeyPressOptions = {}
) {
  const documentRef = useRef(document)
  const { event = defaultEvents, target } = option

  useEventListener(target || documentRef, event, (event) => {
    // 生成 formatter 函数
    const genGuard = genKeyFormatter(keyFilter)
    // 如果能匹配
    if (genGuard(event)) {
      return eventHandler(event)
    }
  })
}
export type {
  KeyPredicate,
  KeyFilter,
  keyEvent,
  keyType,
  UseKeyPressOptions,
  KeyboardEventHandler
}
export default useKeyPress
