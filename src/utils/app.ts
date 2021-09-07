import { produce } from 'immer'
import { UbuntuApp, FolderConfig } from '@/typings/app'

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

// TODO: no need
// export function matchApp(id: string, apps: UbuntuApp[]): UbuntuApp | null {
//   const paths = id.split('/')
//   let currentApp: UbuntuApp | null = null
//   let currentApps = apps
//   while (paths.length) {
//     const path = paths.shift()!
//     currentApp = currentApps.find((app) => app.id === path) || null
//     if (currentApp && isFolder(currentApp)) {
//       currentApps = currentApp.apps
//     }
//     // the path is wrong
//     if (!currentApp) {
//       return null
//     }
//   }
//   return currentApp
// }
