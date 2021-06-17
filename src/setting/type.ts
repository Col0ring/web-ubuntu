import React from 'react'

export interface SettingContextValue {
  ubuntu: React.MutableRefObject<HTMLDivElement | null>
  // 0 - 100
  brightness: number
}
