/* eslint-disable no-param-reassign */
import React from 'react'
import { createDraft, finishDraft } from 'immer'
import { createMethodsContext } from 'react-use-methods'
import useImmerMethods from '@/hooks/common/useImmerMethods'
import {
  AppConfig,
  AppPosition,
  FolderConfig,
  OpenedAppConfig,
  UbuntuApp,
} from '@/typings/app'
import { DesktopContextValue } from './type'
import { defaultImages } from './config'
import apps from './apps'
import {
  getBackgroundImage,
  appArr2Map,
  moveApp,
  setBackgroundImage,
  pasteApp,
  isValidFolder,
} from './util'
import message from '@/components/message'
import { SpecialFolder } from './constants'
import { addBase } from '@/utils/prod'

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
        setCopiedAppId(id: string) {
          state.copiedAppId = id
          return state
        },
        setNewFolderModal(visible: boolean) {
          state.newFolderModal = visible
          return state
        },
        setNewFolderModalFolderId(id: string) {
          state.newFolderModalFolderId = id
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
        // setNewFolderModal 时的鼠标位置
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
        addNewFolder(
          parentId: string,
          name: string,
          position: UbuntuApp['position']
        ) {
          const parentFolder = state.appMap[parentId] as FolderConfig
          const id = `${parentId}/${name}`
          if (parentFolder.apps.find((app) => app.id === id)) {
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
            parentId,
            folder: true,
            icon: addBase('/themes/Yaru/system/folder.png'),
            disabled: false,
            position,
            apps: [],
            render: (currentId) =>
              React.createElement(Folder, {
                id: currentId,
              }),
          }
          this.setNewFolderModal(false)
          // state.apps auto change
          parentFolder.apps.push(newFolder)
          state.appMap[id] = newFolder
          return state
        },
        // TODO
        addFolderApp(app: UbuntuApp) {
          state.appMap[app.id] = app
          const parentFolder = state.appMap[app.parentId] as FolderConfig
          parentFolder.apps.push(app)
          return state
        },
        async pasteFolderApp({
          parentId,
          position,
          copiedId,
        }: {
          parentId: string
          copiedId: string
          position?: AppPosition
        }) {
          const newState = createDraft(state)
          if (!isValidFolder(newState.appMap, copiedId, parentId)) {
            message.error({
              content: 'Something Wrong',
              description:
                'can not move itself or parent folder to the directory',
            })
            return finishDraft(newState)
          }
          return await pasteApp(newState, copiedId, parentId, position)
        },
        async updateFolderApp({
          from,
          to,
          data,
        }: {
          from: string
          to: string
          data: UbuntuApp
        }) {
          const newState = createDraft(state)
          if (!isValidFolder(newState.appMap, data.id, to)) {
            message.error({
              content: 'Something Wrong',
              description:
                'can not move itself or parent folder to the directory',
            })
            return finishDraft(newState)
          }
          const fromFolder = newState.appMap[from] as FolderConfig
          const prevPosition = newState.appMap[data.id].position
          // 先改变原值
          newState.appMap[data.id] = data

          if (from === to) {
            const openedFromFolder = newState.openedAppMap[from]
            if (openedFromFolder) {
              openedFromFolder.apps = openedFromFolder.apps!.map((app) => {
                if (app.id === data.id) {
                  return data
                }
                return app
              })
              newState.openedApps = newState.openedApps.map((app) => {
                if (app.id === from) {
                  return openedFromFolder
                }
                return app
              })
            }
            fromFolder.apps = fromFolder.apps.map((app) => {
              if (app.id === data.id) {
                return data
              }
              return app
            })
            return finishDraft(newState)
          } else {
            const toFolder = newState.appMap[to] as FolderConfig
            const ids = data.id.split('/')
            const id = `${toFolder.id}/${ids[ids.length - 1]}`
            const parentId = toFolder.id
            const prevId = data.id
            const prevParentId = fromFolder.id
            return moveApp(newState, {
              currentId: id,
              prevId,
              parentId,
              prevParentId,
              prevPosition,
            })
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
        maximizeApp(id: string, app: UbuntuApp) {
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
      newFolderModalFolderId: '',
      defaultAppWindow: {
        width: '85%',
        height: '80%',
        minWidth: window.innerWidth / 3,
        minHeight: window.innerHeight / 3,
      },
      allAppsScreen: false,
      lockScreen: false,
      focusAppId: '',
      copiedAppId: '',
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
