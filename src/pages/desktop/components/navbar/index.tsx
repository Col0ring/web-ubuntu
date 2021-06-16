import React from 'react'
import Clock from '@/components/clock'
import Status from './status'
import { StatusIcon } from '../../type'

const statusIcon: StatusIcon[] = [
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
]

const Navbar: React.FC = () => {
  return (
    <div className="absolute top-0 right-0 w-screen shadow-md flex flex-nowrap justify-between items-center bg-ub-grey text-ubt-grey text-sm select-none z-50">
      <Clock />
      <Status icons={statusIcon} />
    </div>
  )
}

export default Navbar
