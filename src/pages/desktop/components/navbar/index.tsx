import React, { useCallback, useMemo, useState } from 'react'
import Clock from '@/components/clock'
import ClickUnderline from '@/components/click-underline'
import useSettingContext from '@/hooks/useSettingContext'
import Arrow from '@/components/arrow'
import Slider, { SliderProps } from '@/components/slider'
import Status from './status'
import StatusMenu from './status-menu'
import { StatusIconConfig, StatusMenuConfig } from '../../type'
import { useAuthContext } from '@/auth/provider'
import { useDesktopContext } from '../../provider'
import { SpecialFolder } from '../../constants'
import { addBase } from '@/utils/prod'

const Navbar: React.FC = () => {
  const [statusMenuVisible, setStatusMenuVisible] = useState(false)

  const [, authMethods] = useAuthContext()

  const [settingStatus, settingMethods] = useSettingContext()

  const [{ appMap }, desktopMethods] = useDesktopContext()
  const {
    config: { sound, brightness },
  } = settingStatus

  const onSoundChange: Required<SliderProps>['onChange'] = useCallback(
    (value) => {
      settingMethods.setSound(value)
    },
    [settingMethods]
  )
  const onBrightnessChange: Required<SliderProps>['onChange'] = useCallback(
    (value) => {
      settingMethods.setBrightness(value)
    },
    [settingMethods]
  )

  const onStatusClick = useCallback(() => {
    setStatusMenuVisible(true)
  }, [setStatusMenuVisible])

  const onStatusMenuVisibleClickAway = useCallback(() => {
    setStatusMenuVisible(false)
  }, [setStatusMenuVisible])

  // TODO: real config
  const statusIcon: StatusIconConfig[] = useMemo(
    () => [
      {
        icon: addBase(
          '/themes/Yaru/status/network-wireless-signal-good-symbolic.svg'
        ),
        name: 'ubuntu wifi',
      },
      {
        icon: addBase('/themes/Yaru/status/audio-volume-medium-symbolic.svg'),
        name: 'ubuntu sound',
      },
      {
        icon: addBase('/themes/Yaru/status/battery-good-symbolic.svg'),
        name: 'ubuntu battry',
      },
    ],
    []
  )

  const statusMenus = useMemo<StatusMenuConfig[][]>(
    () => [
      [
        {
          image: addBase('/themes/Yaru/status/audio-headphones-symbolic.svg'),
          imageAlt: 'ubuntu headphone',
          render: () => (
            <Slider
              onChange={onSoundChange}
              className="ubuntu-slider w-2/3"
              value={sound}
            />
          ),
        },
        {
          image: addBase('/themes/Yaru/status/display-brightness-symbolic.svg'),
          imageAlt: 'ubuntu brightness',
          render: () => (
            <Slider
              onChange={onBrightnessChange}
              className="ubuntu-slider w-2/3"
              value={brightness}
            />
          ),
        },
      ],
      [
        {
          image: addBase(
            '/themes/Yaru/status/network-wireless-signal-good-symbolic.svg'
          ),
          imageAlt: 'ubuntu wifi',
          render: () => (
            <div className="w-2/3 flex items-center justify-between text-gray-400">
              <span>OnePlus 8 Pro</span>
              <Arrow direction="right" />
            </div>
          ),
        },
        {
          image: addBase('/themes/Yaru/status/battery-good-symbolic.svg'),
          imageAlt: 'ubuntu battery',
          render: () => (
            <div className="w-2/3 flex items-center justify-between text-gray-400">
              <span>Off</span>
              <Arrow direction="right" />
            </div>
          ),
        },
        {
          image: addBase('/themes/Yaru/status/bluetooth-symbolic.svg'),
          imageAlt: 'ubuntu battery',
          render: () => (
            <div className="w-2/3 flex items-center justify-between text-gray-400">
              <span>2:40 Remaining (75%)</span>
              <Arrow direction="right" />
            </div>
          ),
        },
      ],
      [
        {
          image: addBase('/themes/Yaru/status/emblem-system-symbolic.svg'),
          imageAlt: 'ubuntu settings',
          name: 'Settings',
          onClick: () => {
            desktopMethods.openApp(
              SpecialFolder.Settings,
              appMap[SpecialFolder.Settings]
            )
          },
        },
        {
          image: addBase('/themes/Yaru/status/changes-prevent-symbolic.svg'),
          imageAlt: 'ubuntu lock',
          name: 'Lock',
          onClick: () => {
            desktopMethods.setLockScreen(true)
          },
        },
        {
          image: addBase('/themes/Yaru/status/system-shutdown-symbolic.svg'),
          imageAlt: 'ubuntu power',
          render: () => (
            <div className="w-2/3 flex items-center justify-between">
              <span>Power Off / Log Out</span>
              <Arrow direction="right" />
            </div>
          ),
          onClick: () => {
            authMethods.logout()
          },
        },
      ],
    ],
    [
      onSoundChange,
      sound,
      onBrightnessChange,
      brightness,
      desktopMethods,
      appMap,
      authMethods,
    ]
  )

  return (
    <div className="absolute top-0 left-0 w-full shadow-md flex flex-nowrap justify-between items-center bg-ub-grey text-ubt-grey text-sm select-none z-60">
      <ClickUnderline>Activities</ClickUnderline>
      <ClickUnderline className="text-xs md:text-sm">
        <Clock />
      </ClickUnderline>
      <ClickUnderline className="relative" onClick={onStatusClick}>
        <Status icons={statusIcon} />
        <StatusMenu
          visible={statusMenuVisible}
          menus={statusMenus}
          onClickAway={onStatusMenuVisibleClickAway}
        />
      </ClickUnderline>
    </div>
  )
}

export default Navbar
