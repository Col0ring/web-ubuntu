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
      openNewApp(id: string, app: AppConfig) {
        return {
          ...state,
          openApps: {
            ...state.openApps,
            [id]: app
          }
        }
      }
    }),
    {
      backgroundImage: 'wall-2',
      openApps: {},
      desktopApps: {},
      sidebarApps: {},
      minimizedApps: {},
      apps
    } as DesktopContextValue
  )

export { DesktopProvider, useDesktopContext, withDesktopProvider }
