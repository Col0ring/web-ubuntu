import React, { useRef } from 'react'
import classnames from 'classnames'
import useClickAway, { EventType } from '@/hooks/common/useClickAway'
import Transition from '@/components/transition'
import StatusMenuItem from './status-menu-item'
import { StatusMenuConfig } from '../../../type'
import Separator from './separator'
import './style.less'

export interface StatusMenuProps {
  menus: StatusMenuConfig[][]
  onClickAway?: (e: EventType) => void
  // ms
  animateDuration?: number
  visible?: boolean
}

const StatusMenu: React.FC<StatusMenuProps> = ({
  menus,
  onClickAway,
  visible
}) => {
  const statusMenuRef = useRef<HTMLDivElement | null>(null)

  const statusMenuClassName = classnames(
    'absolute bg-ub-cool-grey rounded-md py-4 top-9 right-3 shadow border-black border border-opacity-20 status-menu'
  )

  return (
    <Transition
      enterClassName="status-menu-show"
      leaveClassName="status-menu-leave"
      duration={200}
      nodeRef={statusMenuRef}
      visible={visible}
    >
      <div ref={statusMenuRef} className={statusMenuClassName}>
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
        <StatusMenuHelper
          statusMenuRef={statusMenuRef}
          onClickAway={onClickAway}
        />
      </div>
    </Transition>
  )
}
interface StatusMenuHelperProps {
  statusMenuRef: React.MutableRefObject<HTMLDivElement | null>
  onClickAway: StatusMenuProps['onClickAway']
}
const StatusMenuHelper: React.FC<StatusMenuHelperProps> = ({
  statusMenuRef,
  onClickAway
}) => {
  useClickAway(statusMenuRef, (e) => {
    onClickAway?.(e)
  })
  return null
}

export default StatusMenu
