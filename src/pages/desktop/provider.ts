/* eslint-disable no-param-reassign */
import React from 'react'
import { createMethodsContext } from 'react-use-methods'
import useImmerMethods from '@/hooks/common/useImmerMethods'
import apps from '@/apps'
import {
  AppConfig,
  FolderConfig,
  OpenedAppConfig,
  UbuntuApp,
} from '@/typings/app'
import { DesktopContextValue } from './type'
import { defaultImages } from './config'
import { getBackgroundImage, setBackgroundImage } from './util'
import message from '@/components/message'
import { appArr2Map } from '@/utils/app'
import { SpecialFolder } from './constants'

const Folder = React.lazy(() => import('@/pages/desktop/apps/folder'))
const appMap = appArr2Map(apps)
const [useDesktopContext, DesktopProvider, withDesktopProvider] =
  createMethodsContext(
    (state) => [
      {
        chooseBackgroundImage(image: string) {
          setBackgroundImage(image)
          state.backgroundImage = image
          return state
        },
        setNewFolderModal(visible: boolean) {
          state.newFolderModal = visible
          return state
        },
        setAllAppsScreen(visible: boolean) {
          state.allAppsScreen = visible
          return state
        },
        setLockScreen(visible: boolean) {
          state.lockScreen = visible
          return state
        },
        setMousePosition(position: DesktopContextValue['mousePosition']) {
          state.mousePosition = position
          return state
        },
        // resize browser window
        resizeBrowserWindow(width: number, height: number) {
          state.defaultAppWindow.minHeight = height / 3
          state.defaultAppWindow.minWidth = width / 3
          return state
        },
        updateOpenedApp(id: string, app: OpenedAppConfig) {
          state.openedApps = state.openedApps.map((openedApp) => {
            if (openedApp.id === id) {
              return app
            }
            return openedApp
          })
          state.openedAppMap[id] = app
          return state
        },
        // current desktop folder
        addNewFolder(name: string, position: UbuntuApp['position']) {
          const desktop = state.appMap[SpecialFolder.Desktop] as FolderConfig
          const id = `${SpecialFolder.Desktop}/${name}`
          if (desktop.apps.find((desktopApp) => desktopApp.id === id)) {
            message.error({
              content: 'Something Wrong',
              description: `The name ${name} is already in use. Please choose another name`,
              duration: 5000,
            })
            return state
          }
          const newFolder: FolderConfig = {
            id,
            title: name,
            parentId: SpecialFolder.Desktop,
            folder: true,
            icon: './themes/Yaru/system/folder.png',
            disabled: false,
            position,
            apps: [],
            render: () =>
              React.createElement(Folder, {
                id: name,
              }),
          }
          this.setNewFolderModal(false)
          // state.apps auto change
          desktop.apps.push(newFolder)
          state.appMap[id] = newFolder
          return state
        },
        updateFolderApp({
          from,
          to,
          data,
        }: {
          from: string
          to: string
          data: UbuntuApp
        }) {
          const fromFolder = state.appMap[from] as FolderConfig
          if (from === to) {
            state.appMap[data.id] = data
            return state
          } else {
            const toFolder = state.appMap[to] as FolderConfig
            fromFolder.apps = fromFolder.apps.filter(
              (app) => app.id !== data.id
            )
            const ids = data.id.split('/')
            const id = `${toFolder.id}/${ids[ids.length - 1]}`
            const newApp = {
              ...data,
              parentId: toFolder.id,
              id,
            }
            toFolder.apps.push(newApp)
            Reflect.deleteProperty(state.appMap, data.id)
            state.appMap[id] = newApp
            return state
          }
        },
        openApp(currentId: string, app: UbuntuApp) {
          const id = app.redirect || currentId
          if (state.openedAppMap[id]) {
            const currentOpenedApp = state.openedAppMap[id]
            Reflect.deleteProperty(state.minimizedApps, id)

            state.openedApps = [
              ...state.openedApps.filter((openedApp) => openedApp.id !== id),
              currentOpenedApp,
            ]
            state.focusAppId = id
            return state
          }
          const defaultOpenedApp: OpenedAppConfig = {
            ...state.appMap[id],
            rect: {
              ...state.defaultAppWindow,
            },
            windowPosition: {
              left: 0,
              top: 0,
            },
          }
          state.focusAppId = id
          state.openedApps.push(defaultOpenedApp)
          state.openedAppMap[id] = defaultOpenedApp
          return state
        },
        closeApp(id: string) {
          state.focusAppId = state.focusAppId === id ? '' : state.focusAppId
          state.openedApps = state.openedApps.filter((app) => app.id !== id)
          Reflect.deleteProperty(state.maximizedApps, id)
          Reflect.deleteProperty(state.minimizedApps, id)
          Reflect.deleteProperty(state.openedAppMap, id)

          return state
        },
        minimizeApp(id: string, app: AppConfig) {
          if (state.minimizedApps[id]) {
            Reflect.deleteProperty(state.minimizedApps, id)
          } else {
            state.minimizedApps[id] = app
          }
          state.focusAppId = state.focusAppId === id ? '' : state.focusAppId
          return state
        },
        maximizeApp(id: string, app: AppConfig) {
          if (state.maximizedApps[id]) {
            Reflect.deleteProperty(state.maximizedApps, id)
          } else {
            state.maximizedApps[id] = app
          }
          state.focusAppId = id
          return state
        },
        clickApp(id: string, app: UbuntuApp) {
          const folder = state.appMap[app.parentId] as FolderConfig
          folder.apps = [
            ...folder.apps.filter(
              (currentFolderApp) => currentFolderApp.id !== id
            ),
            app,
          ]
          return state
        },
      },
    ],
    {
      backgroundImage: getBackgroundImage() || defaultImages['wall-2'],
      backgroundImages: defaultImages,
      mousePosition: {
        clientX: 0,
        clientY: 0,
      },
      newFolderModal: false,
      defaultAppWindow: {
        width: '85%',
        height: '80%',
        minWidth: window.innerWidth / 3,
        minHeight: window.innerHeight / 3,
      },
      allAppsScreen: false,
      lockScreen: false,
      focusAppId: '',
      openedAppMap: {},
      openedApps: [],
      minimizedApps: {},
      maximizedApps: {},
      frequentApps: (appMap[SpecialFolder.Application] as FolderConfig).apps,
      favoriteApps: (appMap[SpecialFolder.Application] as FolderConfig).apps,
      /**
       * apps 下面只有第一层子项
       */
      appMap,
    } as DesktopContextValue,
    useImmerMethods
  )

export { DesktopProvider, useDesktopContext, withDesktopProvider }
