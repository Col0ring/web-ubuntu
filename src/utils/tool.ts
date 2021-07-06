import React from 'react'
import { Key, ResolvePromise } from '@/typings/tools'

// eslint-disable-next-line @typescript-eslint/no-empty-function
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
