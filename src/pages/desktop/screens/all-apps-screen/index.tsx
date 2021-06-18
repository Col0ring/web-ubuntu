import React, { useCallback, useState } from 'react'
import Tabs, { TabsProps } from '@/components/tabs'
import App, { AppProps } from '@/components/app'
import SearchInput from './search-input'
import { useDesktopContext } from '../../provider'

const tabs: TabsProps['tabs'] = [
  {
    name: 'Frequent'
  },
  {
    name: 'All'
  }
]

const AllAppsScreen: React.FC = () => {
  // TODO: frequentApps sort
  const [{ apps, frequentApps }, desktopMethods] = useDesktopContext()
  const [active, setActive] = useState<'All' | 'Frequent'>('All')
  const onTabItemClick: Required<TabsProps>['onItemClick'] = useCallback(
    (name) => {
      setActive(name as 'All' | 'Frequent')
    },
    [setActive]
  )
  const onAppOpen: Required<AppProps>['onDoubleClick'] = useCallback(
    (id, app) => {
      // TODO: app z-index
      desktopMethods.openApp(id, app)
      desktopMethods.setAllAppsScreen(false)
    },
    [desktopMethods]
  )

  return (
    <div
      style={{ paddingLeft: 52 }}
      className="absolute h-full w-full left-0 top-0 z-30 justify-center border-black border-opacity-60 bg-black bg-opacity-70"
    >
      <div style={{ paddingTop: 30 }} className="relative w-full h-full">
        <div className="flex p-5 align-center justify-center">
          <SearchInput placeholder="Type to Search..." />
        </div>
        {/* apps */}
        <div className="flex flex-wrap">
          {active === 'Frequent'
            ? frequentApps.map((app) => (
                <App key={app.id} onDoubleClick={onAppOpen} app={app} />
              ))
            : apps.map((app) => (
                <App key={app.id} onDoubleClick={onAppOpen} app={app} />
              ))}
        </div>

        <div className="flex items-center p-2 justify-center absolute left-0 bottom-0 mb-15 w-full">
          <div className="w-1/2">
            <Tabs
              active={active}
              onItemClick={onTabItemClick}
              fontSize={16}
              stretch
              tabs={tabs}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllAppsScreen
