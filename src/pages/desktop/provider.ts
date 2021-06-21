import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import apps from '@/apps'
import { AppConfig } from '@/typings/app'
import { DesktopContextValue } from './type'
import { defaultWindowRect, defaultImages } from './config'

const [useDesktopContext, DesktopProvider, withDesktopProvider] =
  createMethodsContext(
    (state) => ({
      chooseBackgroundImage(image: string) {
        return { ...state, backgroundImage: image }
      },
      setAllAppsScreen(visible: boolean) {
        return { ...state, allAppsScreen: visible }
      },
      setLockScreen(visible: boolean) {
        return { ...state, lockScreen: visible }
      },
      openApp(id: string, app: AppConfig) {
        if (state.openedApps[id]) {
          return { ...state, focusAppId: id }
        }
        return {
          ...state,
          focusAppId: id,
          openedApps: {
            ...state.openedApps,
            [id]: {
              ...app,
              rect: { ...defaultWindowRect }
            }
          }
        }
      },
      closeApp(id: string) {
        return {
          ...state,
          focusAppId: state.focusAppId === id ? '' : state.focusAppId,
          openedApps: {
            ...state.openedApps,
            [id]: null
          }
        }
      },
      minimizeApp(id: string, app: AppConfig) {
        return {
          ...state,
          minimizedApps: {
            ...state.minimizedApps,
            [id]: app
          }
        }
      }
    }),
    {
      backgroundImage: defaultImages['wall-2'],
      backgroundImages: defaultImages,
      allAppsScreen: false,
      lockScreen: false,
      focusAppId: '',
      openedApps: {},
      minimizedApps: {},
      frequentApps: [],
      apps
    } as DesktopContextValue
  )

export { DesktopProvider, useDesktopContext, withDesktopProvider }
