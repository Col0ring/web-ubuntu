import React from 'react'
import { AppConfig } from '@/typings/app'
import { StatusMenuItemProps } from './components/navbar/status-menu/status-menu-item'

export interface StatusIconConfig {
  icon: string
  name: string
}

export interface StatusMenuConfig extends StatusMenuItemProps {
  render?: () => React.ReactNode
}

export type Apps = Record<string, AppConfig>
export interface DesktopContextValue {
  backgroundImage: string
  backgroundImages: Record<string, string>
  allAppsScreen: boolean
  lockScreen: boolean
  focusAppId: string
  openApps: Apps
  minimizedApps: Apps
  frequentApps: AppConfig[]
  apps: AppConfig[]
}
