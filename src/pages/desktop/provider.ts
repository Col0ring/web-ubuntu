import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import apps from '@/apps'
import { AppConfig, DesktopAppConfig, OpenedAppConfig } from '@/typings/app'
import { DesktopContextValue } from './type'
import { defaultImages } from './config'
import { getBackgroundImage, setBackgroundImage } from './util'

const [useDesktopContext, DesktopProvider, withDesktopProvider] =
  createMethodsContext(
    (state) => ({
      chooseBackgroundImage(image: string) {
        setBackgroundImage(image)
        return { ...state, backgroundImage: image }
      },
      setNewFolderModal(visible) {
        return { ...state, newFolderModal: visible }
      },
      setMousePosition(position: DesktopContextValue['mousePosition']) {
        return {
          ...state,
          mousePosition: position
        }
      },
      resizeWindow(width: number, height: number) {
        return {
          ...state,
          defaultAppWindow: {
            ...state.defaultAppWindow,
            minHeight: height / 3,
            minWidth: width / 3
          }
        }
      },
      setSidebar(visible: boolean) {
        return { ...state, sidebar: visible }
      },
      setAllAppsScreen(visible: boolean) {
        return { ...state, allAppsScreen: visible }
      },
      setLockScreen(visible: boolean) {
        return { ...state, lockScreen: visible }
      },
      openApp(id: string, app: AppConfig) {
        if (state.openedApps[id]) {
          const openedApp = state.openedApps[id]!
          return {
            ...state,
            minimizedApps: {
              ...state.minimizedApps,
              [id]: null
            },
            openedAppsArr: [
              ...state.openedAppsArr.filter((app) => app.id !== id),
              openedApp
            ],
            focusAppId: id
          }
        }
        const defaultOpenedApp = {
          ...app,
          rect: { ...state.defaultAppWindow },
          position: {
            left: 0,
            top: 0
          }
        }

        return {
          ...state,
          focusAppId: id,
          openedAppsArr: [...state.openedAppsArr, defaultOpenedApp],
          openedApps: {
            ...state.openedApps,
            [id]: defaultOpenedApp
          }
        }
      },
      updateOpenedApp(id: string, app: OpenedAppConfig) {
        return {
          ...state,
          openedApps: {
            ...state.openedApps,
            [id]: app
          },
          openedAppsArr: state.openedAppsArr.map((openedApp) => {
            if (openedApp.id === id) {
              return app
            }
            return openedApp
          })
        }
      },
      addNewFolder(name: string, position: DesktopAppConfig['position']) {
        return {
          ...state,
          desktopApps: [
            ...state.desktopApps,
            {
              id: name,
              title: name,
              icon: './themes/Yaru/system/user-home.png',
              disabled: false,
              shortcut: true,
              favorite: false,
              position
            }
          ]
        }
      },
      updateDesktopApp(id: string, app: DesktopAppConfig) {
        return { ...state }
      },
      closeApp(id: string) {
        return {
          ...state,
          focusAppId: state.focusAppId === id ? '' : state.focusAppId,
          openedApps: {
            ...state.openedApps,
            [id]: null
          },
          openedAppsArr: state.openedAppsArr.filter((app) => app.id !== id),
          maximizedApps: {
            ...state.maximizedApps,
            [id]: null
          },
          minimizedApps: {
            ...state.minimizedApps,
            [id]: null
          }
        }
      },
      minimizeApp(id: string, app: AppConfig) {
        if (state.minimizedApps[id]) {
          return {
            ...state,
            minimizedApps: {
              ...state.maximizedApps,
              [id]: null
            }
          }
        }
        return {
          ...state,
          minimizedApps: {
            ...state.minimizedApps,
            [id]: app
          }
        }
      },
      maximizeApp(id: string, app: AppConfig) {
        if (state.maximizedApps[id]) {
          return {
            ...state,
            maximizedApps: {
              ...state.maximizedApps,
              [id]: null
            },
            focusAppId: id
          }
        }
        return {
          ...state,
          maximizedApps: {
            ...state.maximizedApps,
            [id]: app
          },
          focusAppId: id
        }
      },
      clickDesktopApp(id: string, app: AppConfig) {
        const desktopApp = state.desktopApps.find(
          (desktopApp) => desktopApp.id === id
        )!
        return {
          ...state,
          desktopApps: [
            ...state.desktopApps.filter((desktopApp) => desktopApp.id !== id),
            desktopApp
          ]
        }
      }
    }),
    {
      backgroundImage: getBackgroundImage() || defaultImages['wall-2'],
      backgroundImages: defaultImages,
      mousePosition: {
        clientX: 0,
        clientY: 0
      },
      newFolderModal: false,
      defaultAppWindow: {
        width: '85%',
        height: '80%',
        minWidth: window.innerWidth / 3,
        minHeight: window.innerHeight / 3
      },
      allAppsScreen: false,
      lockScreen: false,
      focusAppId: '',
      openedApps: {},
      openedAppsArr: [],
      minimizedApps: {},
      maximizedApps: {},
      frequentApps: [],
      desktopApps: apps
        .filter((app) => app.shortcut)
        .map((app) => ({
          ...app,
          position: {
            left: 0,
            top: 0
          }
        })),
      apps
    } as DesktopContextValue
  )

export { DesktopProvider, useDesktopContext, withDesktopProvider }
