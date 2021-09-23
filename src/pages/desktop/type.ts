import React from 'react'
import {
  UbuntuApp,
  AppConfig,
  OpenedAppConfig,
  AppPositionValue,
} from '@/typings/app'
import { StatusMenuItemProps } from './components/navbar/status-menu/status-menu-item'

export interface StatusIconConfig {
  icon: string
  name: string
}

export interface StatusMenuConfig extends StatusMenuItemProps {
  render?: () => React.ReactNode
}

export type AppMap = Record<string, UbuntuApp>
export type OpenedAppMap = Record<string, OpenedAppConfig>

export interface DesktopContextValue {
  backgroundImage: string
  backgroundImages: Record<string, string>
  // when open contextmenu in desktop
  mousePosition: {
    clientX: number
    clientY: number
  }
  defaultAppWindow: {
    width: AppPositionValue
    height: AppPositionValue
    minWidth: AppPositionValue
    minHeight: AppPositionValue
  }
  newFolderModal: boolean
  newFileModal: boolean
  // current folder id when newFolderModal or newFileModal is visible
  newAppModalFolderId: string
  // all app screen is visible
  allAppsScreen: boolean
  // lok screen is visible
  lockScreen: boolean
  // current app
  focusAppId: string
  copiedAppId: string
  // sort z-index
  openedApps: OpenedAppConfig[]
  openedAppMap: OpenedAppMap
  minimizedApps: AppMap
  maximizedApps: AppMap
  frequentApps: AppConfig[]
  favoriteApps: AppConfig[]
  appMap: AppMap
}
