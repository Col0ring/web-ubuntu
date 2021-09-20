import useTitle from '@/hooks/common/useTitle'
import React, { useEffect, useRef } from 'react'
import { useSettingContext } from './provider'
import './style.less'

const Setting: React.FC = ({ children }) => {
  const ubuntu = useRef<HTMLDivElement | null>(null)
  const [settingState, settingMethods] = useSettingContext()

  useTitle(settingState.title)

  useEffect(() => {
    settingMethods.setUbuntuInstance(ubuntu)
  }, [settingMethods])
  useEffect(() => {
    // at least 0.25 brightness
    ubuntu.current!.style.filter = `brightness(${
      (3 / 400) * settingState.config.brightness + 0.25
    })`
    // TODO: sound
  }, [settingState.config.brightness])
  return (
    <div ref={ubuntu} id="web-ubuntu">
      {children}
    </div>
  )
}

export default Setting
