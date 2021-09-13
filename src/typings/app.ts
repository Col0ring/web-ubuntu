import React from 'react'
import { Percentage } from './tools'

export type AppPositionValue = number | Percentage

export interface AppConfig {
  id: string
  parentId: string
  title: string
  icon?: string
  disabled?: boolean
  // path redirect
  redirect?: string
  render?: (id: string) => React.ReactNode
  // if use immer，please use render to replace it
  component?: React.ComponentType<any> | React.ComponentType
  // position in the folder
  position?: {
    left: AppPositionValue
    top: AppPositionValue
  }
}

export interface OpenedAppConfig
  extends AppConfig,
    Partial<Omit<FolderConfig, keyof AppConfig>> {
  rect: {
    width: AppPositionValue
    height: AppPositionValue
  }
  windowPosition: {
    left: AppPositionValue
    top: AppPositionValue
  }
}

export type UbuntuApp = FolderConfig | AppConfig
export interface FolderConfig extends AppConfig {
  apps: UbuntuApp[]
  folder: boolean
}
