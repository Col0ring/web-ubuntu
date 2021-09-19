/* eslint-disable no-param-reassign */
import { produce, createDraft, finishDraft } from 'immer'
import { FolderConfig, UbuntuApp, AppPosition } from '@/typings/app'
import { createLocalStorage } from '@/utils/local-storage'
import { AppMap, DesktopContextValue } from './type'
import { safeJsonParse } from '@/utils/misc'
import { modal } from '@/components/modal'

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

interface ContextValue {
  currentId: string
  prevId: string
  parentId: string
  prevParentId: string
  prevPosition?: AppPosition
}

export function getPasteApp(
  appMap: AppMap,
  parentId: string,
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
    parentId,
    title: currentTitle,
    id: currentId,
  }
}

export async function pasteApp(
  oldState: DesktopContextValue,
  copiedAppId: string,
  parentId: string,
  position?: AppPosition,
  // Do not pass in
  isDraft = false
) {
  const state = isDraft ? oldState : createDraft(oldState)
  const copiedApp = state.appMap[copiedAppId]
  const parentApp = state.appMap[parentId] as FolderConfig
  const ids = copiedApp.id.split('/')
  const currentId = `${parentId}/${ids[ids.length - 1]}`
  if (isReplaceFile(state.appMap, parentId, copiedApp.parentId, currentId)) {
    const res = await new Promise<boolean>((resolve) => {
      modal.confirm({
        title: 'Something Wrong',
        content: `An older item with the name ${copiedApp.title} already exists at this location. Do you want to replace it with the new item you are moving?`,
        onOk() {
          parentApp.apps = parentApp.apps.filter((app) => app.id !== currentId)
          Reflect.deleteProperty(state.appMap, currentId)
          Reflect.deleteProperty(state.openedAppMap, currentId)
          Reflect.deleteProperty(state.maximizedApps, currentId)
          Reflect.deleteProperty(state.minimizedApps, currentId)
          resolve(true)
        },
        onCancel() {
          resolve(false)
        },
      })
    })
    if (!res) {
      return finishDraft(state)
    }
  }

  const newApp = getPasteApp(state.appMap, parentId, currentId, copiedApp)
  if (position) {
    newApp.position = position
  }

  // 先加进来，好让后面能够递归
  state.appMap[newApp.id] = newApp
  // 已经创建的新的 app
  if (!isDraft) {
    parentApp.apps.push(newApp)
  }
  if (isFolder(newApp)) {
    newApp.apps = [...newApp.apps]
    const len = newApp.apps.length
    for (let i = 0; i < len; i++) {
      const app = newApp.apps[i]
      const childIds = app.id.split('/')
      const currentAppId = `${newApp.id}/${childIds[childIds.length - 1]}`
      // eslint-disable-next-line no-await-in-loop
      await pasteApp(state, app.id, newApp.id, app.position, true)

      newApp.apps[i] = {
        ...app,
        id: currentAppId,
        parentId: newApp.id,
      }
    }
  }

  return isDraft ? state : finishDraft(state)
}

export async function moveApp(
  // immer
  oldState: DesktopContextValue,
  { currentId, prevId, parentId, prevParentId, prevPosition }: ContextValue,
  // Do not pass in
  isDraft = false
) {
  const state = isDraft ? oldState : createDraft(oldState)
  const currentApp = state.appMap[prevId]
  const parentApp = state.appMap[parentId] as FolderConfig
  const prevParentApp = state.appMap[prevParentId] as FolderConfig

  if (isReplaceFile(state.appMap, parentId, prevParentId, currentId)) {
    const res = await new Promise<boolean>((resolve) => {
      modal.confirm({
        title: 'Something Wrong',
        content: `An older item with the name ${state.appMap[currentId].title} already exists at this location. Do you want to replace it with the new item you are moving?`,
        onOk() {
          parentApp.apps = parentApp.apps.filter((app) => app.id !== currentId)
          Reflect.deleteProperty(state.appMap, currentId)
          Reflect.deleteProperty(state.openedAppMap, currentId)
          Reflect.deleteProperty(state.maximizedApps, currentId)
          Reflect.deleteProperty(state.minimizedApps, currentId)
          resolve(true)
        },
        onCancel() {
          currentApp.position = prevPosition
          resolve(false)
        },
      })
    })

    if (!res) {
      return finishDraft(state)
    }
  }

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
    const len = currentApp.apps.length
    for (let i = 0; i < len; i++) {
      const app = currentApp.apps[i]
      const prevAppId = app.id
      const ids = prevAppId.split('/')
      const currentAppId = `${currentId}/${ids[ids.length - 1]}`
      // eslint-disable-next-line no-await-in-loop
      await moveApp(
        state,
        {
          currentId: currentAppId,
          prevId: prevAppId,
          parentId: currentId,
          prevParentId: currentId,
          prevPosition: app.position,
        },
        true
      )
      // eslint-disable-next-line require-atomic-updates
      currentApp.apps[i] = {
        ...app,
        id: currentAppId,
        parentId: currentId,
      }
    }
  }
  return isDraft ? state : finishDraft(state)
}

export function isValidFolder(appMap: AppMap, id: string, toFolderId: string) {
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

export function isReplaceFile(
  appMap: AppMap,
  toFolderId: string,
  fromFolderId: string,
  currentId: string
) {
  return toFolderId !== fromFolderId && appMap[currentId]
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
