import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import apps from '@/apps'
import { AppConfig } from '@/typings/app'
import { DesktopContextValue } from './type'
import { defaultImages } from './config'

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
        if (state.openApps[id]) {
          return { ...state, focusAppId: id }
        }
        return {
          ...state,
          focusAppId: id,
          openApps: {
            ...state.openApps,
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
      openApps: {},
      minimizedApps: {},
      frequentApps: [],
      apps
    } as DesktopContextValue
  )

export { DesktopProvider, useDesktopContext, withDesktopProvider }
