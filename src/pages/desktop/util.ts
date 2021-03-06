/* eslint-disable no-param-reassign */
import { produce, createDraft, finishDraft } from 'immer'
import { FolderConfig, UbuntuApp, AppPosition, AppRect } from '@/typings/app'
import { createLocalStorage } from '@/utils/local-storage'
import { AppMap, DesktopContextValue } from './type'
import { percentage2Decimal, safeJsonParse } from '@/utils/misc'
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

export function getAppId(parentId: string, title: string, filetype?: string) {
  return `${parentId}/${title}${filetype ? '.' + filetype : ''}`
}

export function getAppPosition(
  app: AppRect,
  area: { width: number; height: number },
  index: number,
  row = true
): {
  left: number
  top: number
} {
  let left = 0
  let top = 0
  let appHeight = 0
  let appWidth = 0
  if (typeof app.height === 'string') {
    appHeight = area.height * percentage2Decimal(app.height)
  } else {
    appHeight = app.height
  }
  if (typeof app.width === 'string') {
    appWidth = area.width * percentage2Decimal(app.width)
  } else {
    appWidth = app.width
  }
  if (row) {
    const rowCount = Math.floor(area.width / appWidth)
    left = appWidth * (index % rowCount)
    top = appHeight * Math.floor(index / rowCount)
  } else {
    const colCount = Math.floor(area.height / appHeight)
    left = appWidth * Math.floor(index / colCount)
    top = appHeight * (index % colCount)
  }

  return {
    left,
    top,
  }
}
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

  // ???????????????????????????????????????
  state.appMap[newApp.id] = newApp
  // ????????????????????? app
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
