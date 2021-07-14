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
  position?: {
    left: number | Percentage
    top: number | Percentage
  }
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

export interface DesktopAppConfig extends AppConfig {
  position: {
    left: number | Percentage
    top: number | Percentage
  }
}
export type UbuntuApp = FolderConfig | AppConfig
export interface FolderConfig extends AppConfig {
  apps: UbuntuApp[]
}
