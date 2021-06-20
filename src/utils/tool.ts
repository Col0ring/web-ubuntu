import { Key } from '@/typings/tools'

export function obj2arr<T>(obj: Record<Key, T>): T[] {
  return Object.keys(obj).map((key) => obj[key])
}
