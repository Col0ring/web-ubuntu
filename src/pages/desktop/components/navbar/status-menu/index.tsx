import React, { useRef } from 'react'
import classnames from 'classnames'
import useClickAway, { EventType } from '@/hooks/common/useClickAway'
import StatusMenuItem from './status-menu-item'
import { StatusMenuConfig } from '../../../type'
import Separator from './separator'
import './style.less'

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
  const statusMenuRef = useRef<HTMLDivElement | null>(null)

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
          <React.Fragment key={index}>
            {subMenus.map(({ render, ...props }) => (
              <StatusMenuItem key={props.image} {...props}>
                {render?.()}
              </StatusMenuItem>
            ))}
            {index !== menus.length - 1 && <Separator />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default StatusMenu
