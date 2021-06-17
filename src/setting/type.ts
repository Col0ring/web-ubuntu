import React from 'react'

export interface UbuntuConfig {
  // 0 - 100
  brightness: number
  // 0 - 100
  sound: number
}
export interface SettingContextValue {
  ubuntu: React.MutableRefObject<HTMLDivElement | null>
  config: UbuntuConfig
}
