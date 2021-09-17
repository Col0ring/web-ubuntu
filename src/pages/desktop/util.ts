/* eslint-disable no-param-reassign */
import { produce } from 'immer'
import {
  FolderConfig,
  UbuntuApp,
  OpenedAppConfig,
  AppPosition,
} from '@/typings/app'
import { createLocalStorage } from '@/utils/local-storage'
import { AppMap, OpenedAppMap } from './type'
import { safeJsonParse } from '@/utils/misc'

const { setBackgroundImage, getBackgroundImage } = createLocalStorage(
  'backgroundImage',
  {
    defaultValue: '',
  }
)
export { setBackgroundImage, getBackgroundImage }

const { setMousePosition, getMousePosition } = createLocalStorage(
  'mousePosition',
  {
    defaultValue: {
      x: 0,
      y: 0,
    },
    map(v) {
      return safeJsonParse(v, {
        x: 0,
        y: 0,
      })
    },
  }
)
export { setMousePosition, getMousePosition }

interface AppMaps {
  // immer
  appMap: AppMap
  openedAppMap: OpenedAppMap
  maximizedApps: AppMap
  minimizedApps: AppMap
  openedApps: OpenedAppConfig[]
}

interface ContextIds {
  currentId: string
  prevId: string
  parentId: string
  prevParentId: string
}

export function getPasteApp(
  appMap: AppMap,
  copyAppId: string,
  copiedApp: UbuntuApp
) {
  let currentId = copyAppId
  let currentTitle = copiedApp.title
  while (appMap[currentId]) {
    currentId = `${currentId} copy`
    currentTitle = `${currentTitle} copy`
  }
  return {
    ...copiedApp,
    title: currentTitle,
    id: currentId,
  }
}

export function pasteApp(
  appMap: AppMap,
  copiedAppId: string,
  parentId: string,
  position?: AppPosition
) {
  const copiedApp = appMap[copiedAppId]
  const parentApp = appMap[parentId] as FolderConfig
  const ids = copiedApp.id.split('/')
  const newApp = getPasteApp(
    appMap,
    `${parentId}/${ids[ids.length - 1]}`,
    copiedApp
  )
  if (position) {
    newApp.position = position
  }
  // 先加进来，好让后面能够递归
  appMap[newApp.id] = newApp
  parentApp.apps.push(newApp)

  if (isFolder(newApp)) {
    newApp.apps = [...newApp.apps]
    newApp.apps = newApp.apps.map((app) => {
      const childIds = app.id.split('/')
      const currentAppId = `${newApp.id}/${childIds[childIds.length - 1]}`
      pasteApp(appMap, app.id, newApp.id, app.position)
      return {
        ...app,
        id: currentAppId,
        parentId: newApp.id,
      }
    })
  }
}

export function moveApp(
  // immer
  state: AppMaps,
  { currentId, prevId, parentId, prevParentId }: ContextIds
) {
  const currentApp = state.appMap[prevId]
  const parentApp = state.appMap[parentId] as FolderConfig
  const prevParentApp = state.appMap[prevParentId] as FolderConfig

  currentApp.parentId = parentId
  currentApp.id = currentId
  Reflect.deleteProperty(state.appMap, prevId)
  Reflect.deleteProperty(state.openedAppMap, prevId)
  Reflect.deleteProperty(state.maximizedApps, prevId)
  Reflect.deleteProperty(state.minimizedApps, prevId)
  state.openedApps = state.openedApps.filter((app) => app.id !== prevId)
  state.appMap[currentId] = currentApp
  prevParentApp.apps = prevParentApp.apps.filter((app) => app.id !== prevId)
  parentApp.apps.push(currentApp)

  if (isFolder(currentApp)) {
    currentApp.apps = currentApp.apps.map((app) => {
      const prevAppId = app.id
      const ids = prevAppId.split('/')
      const currentAppId = `${currentId}/${ids[ids.length - 1]}`
      moveApp(state, {
        currentId: currentAppId,
        prevId: prevAppId,
        parentId: currentId,
        prevParentId: currentId,
      })
      return {
        ...app,
        id: currentAppId,
        parentId: currentId,
      }
    })
  }
}

export function validMoveFolder(
  appMap: AppMap,
  id: string,
  toFolderId: string
) {
  if (id === toFolderId) {
    return false
  }
  const currentApp = appMap[id]
  if (isFolder(currentApp)) {
    let toFolder = appMap[toFolderId]
    while (toFolder) {
      if (toFolder.parentId === id) {
        return false
      }
      toFolder = appMap[toFolder.parentId]
    }
    return true
  }
  return true
}

export function isFolder(app: UbuntuApp): app is FolderConfig {
  if (!app) {
    return false
  }
  return (
    Array.isArray((app as FolderConfig).apps) || !!(app as FolderConfig).folder
  )
}

export function appArr2Map(apps: UbuntuApp[]): Record<string, UbuntuApp> {
  const appMap: Record<string, UbuntuApp> = {}
  apps.forEach((app) => {
    appMap[app.id] = app
    if (isFolder(app)) {
      Object.assign(appMap, appArr2Map(app.apps || []))
    }
  })
  return appMap
}

export function appMap2Arr(appMap: Record<string, UbuntuApp>): UbuntuApp[] {
  function loop(
    childrenMap: Record<string, Record<string, UbuntuApp>>,
    parentId: string
  ): UbuntuApp[] {
    const apps: UbuntuApp[] = []
    const map = childrenMap[parentId]
    Object.values(map).forEach((app) => {
      if (app.parentId === parentId) {
        apps.push(app)
      }
    })

    return apps.map((app) => {
      if (isFolder(app)) {
        return produce(app, (draft) => {
          // eslint-disable-next-line no-param-reassign
          draft.apps = loop(childrenMap, app.id) || []
        })
      }
      return app
    })
  }

  const childrenMap: Record<string, Record<string, UbuntuApp>> = {}
  Object.values(appMap).forEach((app) => {
    if (childrenMap[app.parentId]) {
      childrenMap[app.parentId][app.id] = app
    } else {
      childrenMap[app.parentId] = {
        [app.id]: app,
      }
    }
  })
  return loop(childrenMap, '/')
}
