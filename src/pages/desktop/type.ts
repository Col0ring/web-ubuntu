import React from 'react'
import { AppConfig, OpenedAppConfig } from '@/typings/app'
import { StatusMenuItemProps } from './components/navbar/status-menu/status-menu-item'

export interface StatusIconConfig {
  icon: string
  name: string
}

export interface StatusMenuConfig extends StatusMenuItemProps {
  render?: () => React.ReactNode
}

export type Apps = Record<string, AppConfig | null>

export type OpenedApps = Record<string, OpenedAppConfig | null>

export interface DesktopContextValue {
  sidebar: boolean
  backgroundImage: string
  backgroundImages: Record<string, string>
  allAppsScreen: boolean
  lockScreen: boolean
  focusAppId: string
  openedApps: OpenedApps
  minimizedApps: Apps
  frequentApps: AppConfig[]
  apps: AppConfig[]
}
