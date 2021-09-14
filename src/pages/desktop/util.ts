/* eslint-disable no-param-reassign */
import { FolderConfig, OpenedAppConfig } from '@/typings/app'
import { isFolder } from '@/utils/app'
import { createLocalStorage } from '@/utils/local-storage'
import { AppMap, OpenedAppMap } from './type'

const { setBackgroundImage, getBackgroundImage } =
  createLocalStorage('backgroundImage')
export { setBackgroundImage, getBackgroundImage }

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
