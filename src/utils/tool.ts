import React from 'react'
import {
  DomElement,
  DomParam,
  Key,
  MousePosition,
  ResolvePromise,
  Percentage,
} from '@/typings/tools'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}
export function preventDefault(e: React.UIEvent) {
  e.preventDefault()
}
export function stopPropagation(e: React.UIEvent) {
  e.stopPropagation()
}

export function percentage2Decimal(percentage: Percentage) {
  const n = +percentage.slice(0, percentage.length - 1)
  return n / 100
}

export function getOffsetWindow(element: HTMLElement) {
  // 获取元素距离页面顶部的距离
  let { offsetTop, offsetLeft } = element
  let offsetParent = element.offsetParent as HTMLElement
  while (offsetParent) {
    offsetTop += offsetParent.offsetTop
    offsetLeft += offsetParent.offsetLeft
    offsetParent = offsetParent.offsetParent as HTMLElement
  }
  return {
    offsetTop,
    offsetLeft,
  }
}

export function getMousePositionOfDom(
  { clientX, clientY }: MousePosition,
  element: HTMLElement
) {
  const { offsetLeft, offsetTop } = getOffsetWindow(element)
  return {
    left: clientX - offsetLeft,
    top: clientY - offsetTop,
  }
}

export function isRef<T extends DomElement = DomElement>(
  value: DomParam<T>
): value is React.RefObject<T> {
  return (
    value && typeof value === 'object' && Object.keys(value).includes('current')
  )
}

export function getDomElement<T extends DomElement>(
  ref: DomParam<T>
): T | null {
  if (isRef(ref)) {
    return ref.current
  }
  return ref
}

export function obj2arr<T>(obj: Record<Key, T>): T[] {
  return Object.keys(obj).map((key) => obj[key])
}
export function getParentNode(
  node: Node,
  isTarget: (node: Node) => boolean
): Node | null {
  let parentNode: Node | null = node
  while (parentNode) {
    if (isTarget(parentNode)) {
      return parentNode
    }
    parentNode = parentNode.parentNode
  }

  return null
}

export function resolvePromise<T>(value: T) {
  return new Promise<ResolvePromise<T>>((resolve, reject) => {
    if (value instanceof Promise) {
      value
        .then((res) => {
          resolve(resolvePromise(res))
        })
        .catch((err) => reject(err))
    } else {
      resolve(value as ResolvePromise<T>)
    }
  })
}

export function safeJsonParse<T extends Record<string | number | symbol, any>>(
  jsonStr: string,
  defaultValue: T
) {
  try {
    return JSON.parse(jsonStr)
  } catch (err) {
    return defaultValue
  }
}
