import React from 'react'
import { XDirection, YDirection } from '@/typings/tools'

export type MessageType = 'info' | 'success' | 'error' | 'warning'

export interface MessageOptions {
  type?: MessageType
  wrapperClassName?: string
  duration?: number
  direction?: `${YDirection} ${XDirection}`
  content?: React.ReactNode
  description?: React.ReactNode
}

export interface MessageMethods {
  close: () => void
}
