import React from 'react'
import { AppConfig } from '@/typings/app'
import { StatusMenuItemProps } from './components/navbar/status-menu/status-menu-item'

export type BackgroundImageType = `wall-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`

export interface StatusIconConfig {
  icon: string
  name: string
}

export interface StatusMenuConfig extends StatusMenuItemProps {
  render?: () => React.ReactNode
}

export type Apps = Record<string, AppConfig>
export interface DesktopContextValue {
  backgroundImage: BackgroundImageType
  openApps: Apps
  sidebarApps: Apps
  desktopApps: Apps
  minimizedApps: Apps
  apps: AppConfig[]
}
