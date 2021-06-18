import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import apps from '@/apps'
import { AppConfig } from '@/typings/app'

import { BackgroundImageType, DesktopContextValue } from './type'

const [useDesktopContext, DesktopProvider, withDesktopProvider] =
  createMethodsContext(
    (state) => ({
      chooseBackgroundImage(type: BackgroundImageType) {
        return { ...state, backgroundImage: type }
      },
      setAllAppsScreen(visible: boolean) {
        return { ...state, allAppsScreen: visible }
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
      backgroundImage: 'wall-2',
      allAppsScreen: false,
      focusAppId: '',
      openApps: {},
      minimizedApps: {},
      frequentApps: [],
      apps
    } as DesktopContextValue
  )

export { DesktopProvider, useDesktopContext, withDesktopProvider }
