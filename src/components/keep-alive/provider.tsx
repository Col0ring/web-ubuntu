import React from 'react'
import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import { CacheContextValue } from './type'
import { CacheStatus } from './constants'

const [useCacheContext, CacheProvider, withCacheProvider] =
  createMethodsContext(
    (state) => ({
      addCacheElement(cacheId: string, element: React.ReactElement) {
        const cacheElement = state[cacheId]
        // cache
        if (cacheElement) {
          // if refresh or clear
          if (cacheElement.status === CacheStatus.DESTROY) {
            const doms = cacheElement.doms
            doms.forEach((dom) => {
              dom.parentNode?.removeChild(dom)
            })
            return {
              ...state,
              [cacheId]: {
                cacheId,
                doms: [],
                scrolls: {
                  x: 0,
                  y: 0
                },
                element,
                status: CacheStatus.CREATE
              }
            }
          }
          return state
        }
        return {
          ...state,
          [cacheId]: {
            cacheId,
            doms: [],
            element,
            scrolls: {
              x: 0,
              y: 0
            },
            status: CacheStatus.CREATE
          }
        }
      },
      addCacheDoms(cacheId: string, doms: HTMLElement[]) {
        // have element
        if (!state[cacheId]) {
          return state
        }
        return {
          ...state,
          [cacheId]: {
            ...state[cacheId],
            doms,
            status: CacheStatus.CREATED
          }
        }
      },
      renderCacheDoms(
        cacheId: string,
        { scroll, parentNode }: { scroll: boolean; parentNode: HTMLElement }
      ) {
        const cacheElement = state[cacheId]
        // the cache doms
        const doms = cacheElement.doms
        const scrolls = cacheElement.scrolls
        doms.forEach((dom) => parentNode.appendChild(dom))

        if (scroll) {
          parentNode.scrollTo(scrolls.x, scrolls.y)
        }
        return {
          ...state,
          [cacheId]: {
            ...cacheElement,
            status: CacheStatus.ACTIVE
          }
        }
      },

      cacheScroll(cacheId: string, e: Event) {
        const target = e.target as HTMLElement
        return {
          ...state,
          [cacheId]: {
            ...state[cacheId],
            scrolls: {
              x: target.scrollLeft,
              y: target.scrollTop
            }
          }
        }
      },
      activate(cacheId: string) {
        return {
          ...state,
          [cacheId]: {
            ...state[cacheId],
            status: CacheStatus.ACTIVATED
          }
        }
      },
      deactivate(cacheId: string) {
        return {
          ...state,
          [cacheId]: {
            ...state[cacheId],
            status: CacheStatus.DEACTIVATED
          }
        }
      },
      refresh(cacheId: string) {
        return {
          ...state,
          [cacheId]: {
            ...state[cacheId],
            status: CacheStatus.DESTROY
          }
        }
      },
      clear() {
        return Object.keys(state).reduce((prev, next) => {
          prev[next] = { ...state[next], status: CacheStatus.DESTROY }
          return prev
        }, {} as CacheContextValue)
      }
    }),
    {} as CacheContextValue
  )

export { useCacheContext, CacheProvider, withCacheProvider }
