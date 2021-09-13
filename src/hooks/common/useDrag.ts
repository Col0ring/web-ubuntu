import { useCallback, useState } from 'react'
import { Key } from '@/typings/tools'

type UseDragReturn<T> = [
  boolean,
  (data: T) => {
    draggable: 'true'
    onDragStart: (e: React.DragEvent) => void
    onDragEnd: (e: React.DragEvent) => void
  }
]

interface UseDragOptions<T> {
  onDragStart?: (data: T, e: React.DragEvent) => void
  onDragEnd?: (data: T, e: React.DragEvent) => void
  onDrag?: (data: T, e: React.DragEvent) => void
  customDragData?: Record<Key, string>
}

function useDrag<T = any>(options?: UseDragOptions<T>): UseDragReturn<T> {
  const [isDrag, setIsDrag] = useState(false)
  const getProps = useCallback(
    (data: T) => {
      return {
        draggable: 'true' as const,
        onDragStart: (e: React.DragEvent) => {
          setIsDrag(true)
          options?.onDragStart?.(data, e)
          // 额外的属性，可以自行获取
          e.dataTransfer.setData('custom', JSON.stringify(data))
          if (
            options?.customDragData &&
            typeof options.customDragData === 'object'
          ) {
            Object.keys(options.customDragData).forEach((key) => {
              e.dataTransfer.setData(key, options.customDragData![key])
            })
          }
        },
        onDrag: (e: React.DragEvent) => {
          options?.onDrag?.(data, e)
        },
        onDragEnd: (e: React.DragEvent) => {
          setIsDrag(false)
          options?.onDragEnd?.(data, e)
        },
      }
    },
    [Object.values(options || {}), setIsDrag]
  )

  return [isDrag, getProps]
}

export type { UseDragReturn, UseDragOptions }
export default useDrag
