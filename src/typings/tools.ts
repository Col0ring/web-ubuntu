export type Key = string | number | symbol
export type Item<T> = T extends Array<infer U> ? U : never
export type NormalFunction<P extends any[] = any[], R = any> = (...args: P) => R
export type AsyncFunction<P extends any[] = any[], R = any> = (
  ...args: P
) => Promise<R>
