export type Key = string | number | symbol
export type Item<T> = T extends Array<infer U> ? U : never
export type ResolvePromise<T> = T extends Promise<infer U> ? U : T
export type NormalObject<T = any> = Record<Key, T>
export type NormalFunction<P extends any[] = any[], R = any> = (...args: P) => R
export type AsyncFunction<P extends any[] = any[], R = any> = (
  ...args: P
) => Promise<R>
export type DomElement = HTMLElement | Element | Window | Document
export type Percentage = `${number}%`
export type XDirection = 'left' | 'right'
export type YDirection = 'top' | 'bottom'
export type Direction = XDirection | YDirection | `${YDirection} ${XDirection}`
