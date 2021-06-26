import React from 'react'
import { CacheStatus } from './constants'

export interface CacheOptions {
  cacheId: string
  scroll?: boolean
}

export interface CacheItem {
  scrolls: {
    x: number
    y: number
  }
  cacheId: string
  element: React.ReactElement
  doms: HTMLElement[]
  status: CacheStatus
}
export interface CacheContextValue {
  [key: string]: CacheItem
}
