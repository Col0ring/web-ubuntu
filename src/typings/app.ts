import React from 'react'
import { Percentage } from './tools'

export interface AppConfig {
  id: string
  title: string
  icon: string
  disabled?: boolean
  favorite?: boolean
  // 快捷方式
  shortcut?: boolean
  render?: () => React.ReactNode
  component?: React.ComponentType<any> | React.ComponentType
  [prop: string]: any
}

export interface OpenedAppConfig extends AppConfig {
  rect: {
    width: number | Percentage
    height: number | Percentage
  }
  position: {
    left: number | Percentage
    top: number | Percentage
  }
}
