import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import { SettingContextValue } from './type'
import { getBrightness } from './util'

const [useSettingContext, SettingProvider] = createMethodsContext(
  (state) => ({
    setUbuntuInstance(ubuntu: SettingContextValue['ubuntu']) {
      return { ...state, ubuntu }
    },
    setBrightness(brightness: number) {
      return { ...state, brightness }
    }
  }),
  {
    ubuntu: { current: null },
    brightness: getBrightness()
  } as SettingContextValue
)

export { SettingProvider, useSettingContext }
