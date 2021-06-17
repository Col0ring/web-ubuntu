import React, { useRef } from 'react'
import classnames from 'classnames'
import { useSettingContext } from '@/setting/provider'
import useClickAway, { EventType } from '@/hooks/common/useClickAway'
import StatusMenuItem from './status-menu-item'
import { StatusMenuConfig } from '../../../type'
import './style.less'
import Separator from './separator'

export interface StatusMenuProps {
  menus: StatusMenuConfig[][]
  onClickAway?: (e: EventType) => void
  animate?: boolean
  // ms
  animateDuration?: number
}

const StatusMenu: React.FC<StatusMenuProps> = ({
  menus,
  onClickAway,
  animate = true,
  animateDuration = 200
}) => {
  const [settingStatus, settingMethods] = useSettingContext()
  const statusMenuRef = useRef<HTMLDivElement | null>(null)
  const {
    config: { sound, brightness }
  } = settingStatus

  const statusMenuClassName = classnames(
    'absolute bg-ub-cool-grey rounded-md py-4 top-9 right-3 shadow border-black border border-opacity-20',
    {
      'animate-show': animate
    }
  )

  useClickAway(statusMenuRef, (e) => {
    onClickAway?.(e)
  })

  return (
    <div
      ref={statusMenuRef}
      style={{ animationDuration: `${animateDuration}ms` }}
      className={statusMenuClassName}
    >
      {/* tag */}
      <i className="absolute w-0 h-0 -top-2 right-6 top-arrow-up inline-block" />

      {/* menus */}
      {menus.map((subMenus, index) => {
        return (
          <>
            {subMenus.map(({ render, ...props }) => (
              <StatusMenuItem {...props}>{render?.()}</StatusMenuItem>
            ))}
            {index !== menus.length - 1 && <Separator />}
          </>
        )
      })}
    </div>
  )
}

export default StatusMenu
