import React from 'react'
import { UbuntuApp, AppConfig, OpenedAppConfig } from '@/typings/app'
import { Percentage } from '@/typings/tools'
import { StatusMenuItemProps } from './components/navbar/status-menu/status-menu-item'

export interface StatusIconConfig {
  icon: string
  name: string
}

export interface StatusMenuConfig extends StatusMenuItemProps {
  render?: () => React.ReactNode
}

export type Apps = Record<string, UbuntuApp | null>

export type OpenedApps = Record<string, OpenedAppConfig | null>

export interface DesktopContextValue {
  backgroundImage: string
  newFolderModal: boolean
  // when open contextmenu in desktop
  mousePosition: {
    clientX: number
    clientY: number
  }
  defaultAppWindow: {
    width: Percentage
    height: Percentage
    minWidth: number
    minHeight: number
  }
  backgroundImages: Record<string, string>
  // all app screen is visible
  allAppsScreen: boolean
  // lok screen is visible
  lockScreen: boolean
  // current app
  focusAppId: string
  // sort z-index
  openedAppsArr: OpenedAppConfig[]
  openedApps: OpenedApps
  minimizedApps: Apps
  maximizedApps: Apps
  frequentApps: AppConfig[]
  apps: UbuntuApp[]
  appMap: Record<string, UbuntuApp>
}
