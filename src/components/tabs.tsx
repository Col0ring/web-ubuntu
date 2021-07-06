import React from 'react'
import classnames from 'classnames'

export interface TabConfig {
  name: string
  title?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  render?: () => React.ReactNode
}

export interface TabsProps {
  tabs: TabConfig[]
  active?: string
  stretch?: boolean
  className?: string
  fontSize?: number
  itemClassName?: string
  onItemClick?: (name: string, index: number) => void
}
const Tabs: React.FC<TabsProps> = ({
  tabs,
  onItemClick,
  stretch,
  active,
  className,
  fontSize,
  itemClassName,
}) => {
  const tabItemClassName = classnames(
    'flex flex-col group  bg-transparent cursor-pointer items-center',
    {
      'flex-1': stretch,
    },
    itemClassName
  )
  const tabsClassName = classnames('w-full flex', className)

  return (
    <div className={tabsClassName}>
      {tabs.map((tab, index) => (
        <div
          key={tab.name}
          className={tabItemClassName}
          onClick={() => onItemClick?.(tab.name, index)}
        >
          <div
            style={{ fontSize }}
            className="flex-1 flex justify-center items-center text-white"
            onClick={tab.onClick}
          >
            {tab.render ? tab.render() : <span>{tab.title || tab.name}</span>}
          </div>
          <div
            className={`w-full h-1 mt-1 ${
              tab.name === active
                ? 'bg-ub-orange'
                : 'bg-transparent group-hover:bg-white'
            }`}
          />
        </div>
      ))}
    </div>
  )
}

export default Tabs
