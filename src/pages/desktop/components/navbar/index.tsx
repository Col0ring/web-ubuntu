import React, { useCallback, useMemo, useState } from 'react'
import Clock from '@/components/clock'
import ClickUnderline from '@/components/click-underline'
import { useSettingContext } from '@/setting/provider'
import Arrow from '@/components/arrow'
import Slider, { SliderProps } from '@/components/slider'
import Status from './status'
import StatusMenu from './status-menu'
import { StatusIconConfig, StatusMenuConfig } from '../../type'

const Navbar: React.FC = () => {
  const [statusMenuVisible, setStatusMenuVisible] = useState(false)

  const [settingStatus, settingMethods] = useSettingContext()

  const {
    config: { sound, brightness }
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
        icon: '/themes/Yaru/status/network-wireless-signal-good-symbolic.svg',
        name: 'ubuntu wifi'
      },
      {
        icon: '/themes/Yaru/status/audio-volume-medium-symbolic.svg',
        name: 'ubuntu sound'
      },
      {
        icon: '/themes/Yaru/status/battery-good-symbolic.svg',
        name: 'ubuntu battry'
      }
    ],
    []
  )

  const statusMenus = useMemo<StatusMenuConfig[][]>(
    () => [
      [
        {
          image: '/themes/Yaru/status/audio-headphones-symbolic.svg',
          imageAlt: 'ubuntu headphone',
          render: () => (
            <Slider
              onChange={onSoundChange}
              className="ubuntu-slider w-2/3"
              value={sound}
            />
          )
        },
        {
          image: '/themes/Yaru/status/display-brightness-symbolic.svg',
          imageAlt: 'ubuntu brightness',
          render: () => (
            <Slider
              onChange={onBrightnessChange}
              className="ubuntu-slider w-2/3"
              value={brightness}
            />
          )
        }
      ],
      [
        {
          image:
            '/themes/Yaru/status/network-wireless-signal-good-symbolic.svg',
          imageAlt: 'ubuntu wifi',
          render: () => (
            <div className="w-2/3 flex items-center justify-between text-gray-400">
              <span>OnePlus 8 Pro</span>
              <Arrow direction="right" />
            </div>
          )
        },
        {
          image: '/themes/Yaru/status/battery-good-symbolic.svg',
          imageAlt: 'ubuntu battery',
          render: () => (
            <div className="w-2/3 flex items-center justify-between text-gray-400">
              <span>Off</span>
              <Arrow direction="right" />
            </div>
          )
        },
        {
          image: '/themes/Yaru/status/bluetooth-symbolic.svg',
          imageAlt: 'ubuntu battery',
          render: () => (
            <div className="w-2/3 flex items-center justify-between text-gray-400">
              <span>2:40 Remaining (75%)</span>
              <Arrow direction="right" />
            </div>
          )
        }
      ],
      [
        {
          image: '/themes/Yaru/status/emblem-system-symbolic.svg',
          imageAlt: 'ubuntu settings',
          name: 'Settings'
        },
        {
          image: '/themes/Yaru/status/changes-prevent-symbolic.svg',
          imageAlt: 'ubuntu lock',
          name: 'Lock',
          onClick: () => {}
        },
        {
          image: '/themes/Yaru/status/system-shutdown-symbolic.svg',
          imageAlt: 'ubuntu power',
          render: () => (
            <div className="w-2/3 flex items-center justify-between">
              <span>Power Off / Log Out</span>
              <Arrow direction="right" />
            </div>
          ),
          onClick: () => {}
        }
      ]
    ],
    [sound, brightness, onSoundChange, onBrightnessChange]
  )

  return (
    <div className="absolute top-0 right-0 w-screen shadow-md flex flex-nowrap justify-between items-center bg-ub-grey text-ubt-grey text-sm select-none z-50">
      <ClickUnderline>Activities</ClickUnderline>
      <ClickUnderline className="text-xs md:text-sm">
        <Clock />
      </ClickUnderline>
      <ClickUnderline className="relative" onClick={onStatusClick}>
        <Status icons={statusIcon} />
        {statusMenuVisible && (
          <StatusMenu
            menus={statusMenus}
            animate
            animateDuration={200}
            onClickAway={onStatusMenuVisibleClickAway}
          />
        )}
      </ClickUnderline>
    </div>
  )
}

export default Navbar
