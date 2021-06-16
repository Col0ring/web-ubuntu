import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import { BackgroundImageType, DesktopContextValue } from './type'

const [useDesktopContext, DesktopProvider, withDesktopProvider] =
  createMethodsContext(
    (state) => ({
      chooseBackgroundImage(type: BackgroundImageType) {
        return { ...state, backgroundImage: type }
      }
    }),
    {
      backgroundImage: 'wall-2'
    } as DesktopContextValue
  )

export { DesktopProvider, useDesktopContext, withDesktopProvider }
