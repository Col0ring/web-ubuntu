import React from 'react'
import { Key } from '@/typings/tools'
export function noop() {}
export function preventDefault(e: React.UIEvent) {
  e.preventDefault()
}
export function stopPropagation(e: React.UIEvent) {
  e.stopPropagation()
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
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      value
        .then((res) => {
          resolve(resolvePromise(res))
        })
        .catch((err) => reject(err))
    } else {
      resolve(value)
    }
  })
}
