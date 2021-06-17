import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import { SettingContextValue } from './type'
import { getBrightness, getSound, setBrightness, setSound } from './util'

const [useSettingContext, SettingProvider] = createMethodsContext(
  (state) => ({
    setUbuntuInstance(ubuntu: SettingContextValue['ubuntu']) {
      return { ...state, ubuntu }
    },
    setBrightness(brightness: number) {
      setBrightness(brightness)
      return { ...state, config: { ...state.config, brightness } }
    },
    setSound(sound: number) {
      setSound(sound)
      return { ...state, config: { ...state.config, sound } }
    }
  }),
  {
    ubuntu: { current: null },
    config: {
      brightness: getBrightness(),
      sound: getSound()
    }
  } as SettingContextValue
)

export { SettingProvider, useSettingContext }
