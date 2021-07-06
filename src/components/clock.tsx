import React, { useMemo, useState } from 'react'
import classnames from 'classnames'
import useInterval from '@/hooks/common/useInterval'

export interface ClockProps {
  className?: string
  hour12?: boolean
  delay?: number
  showSeconds?: boolean
  type?: 'time' | 'date' | 'default'
}

function prependZero(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

const monthList = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Clock: React.FC<ClockProps> = ({
  className,
  type = 'default',
  showSeconds,
  delay = 1000,
  hour12 = true,
}) => {
  const [date, setDate] = useState(() => new Date())
  const clock = useMemo(() => {
    const week = dayList[date.getDay()]
    let hour = date.getHours()
    const minute = prependZero(date.getMinutes())
    const seconds = prependZero(date.getSeconds())
    const secondsFormat = showSeconds ? `:${seconds}` : ''
    const month = monthList[date.getMonth()]
    const day = date.getDate()
    const meridiem = hour < 12 ? 'AM' : 'PM'
    if (hour12 && hour > 12) {
      hour -= 12
    }
    switch (type) {
      case 'date':
        return `${week} ${month} ${day}`
      case 'time':
        return `${hour}:${minute}${secondsFormat} ${meridiem}`
      case 'default':
      default:
        return `${week} ${month} ${day} ${hour}:${minute}${secondsFormat} ${meridiem}`
    }
  }, [date, type])
  const clockClassName = classnames(className)
  useInterval(() => {
    setDate(new Date())
  }, delay)
  return <span className={clockClassName}>{clock}</span>
}

export default Clock
