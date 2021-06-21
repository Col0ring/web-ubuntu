import React from 'react'
import classnames from 'classnames'
import './style.less'

export interface MainViewProps {
  className?: string
}
const MainView: React.FC<MainViewProps> = ({ children, className }) => {
  const mainViewClassName = classnames(
    'w-full flex-grow z-20 max-h-full overflow-y-auto window-main-view bg-ub-cool-grey',
    className
  )
  return <div className={mainViewClassName}>{children}</div>
}

export default MainView
