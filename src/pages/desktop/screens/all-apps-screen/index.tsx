import React, { useCallback, useState } from 'react'
import classnames from 'classnames'
import Tabs, { TabsProps } from '@/components/tabs'
import Transition from '@/components/transition'
import App, { AppProps } from '@/components/app'
import SearchInput from './search-input'
import { useDesktopContext } from '../../provider'
import './style.less'
import { defaultDesktop } from '../../config'
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
  const [{ apps, allAppsScreen, frequentApps }, desktopMethods] =
    useDesktopContext()
  const [active, setActive] = useState<'All' | 'Frequent'>('All')
  const onTabItemClick: Required<TabsProps>['onItemClick'] = useCallback(
    (name) => {
      setActive(name as 'All' | 'Frequent')
    },
    [setActive]
  )
  const onAppOpen: Required<AppProps>['onOpen'] = useCallback(
    (id, app) => {
      desktopMethods.openApp(id, app)
      desktopMethods.setAllAppsScreen(false)
    },
    [desktopMethods]
  )

  const allAppScreenClassName = classnames(
    'all-apps-screen absolute h-full w-full left-0 top-0 z-30 justify-center border-black border-opacity-60 bg-black bg-opacity-70'
  )
  return (
    <Transition
      duration={200}
      enterClassName="all-apps-screen-show"
      leaveClassName="all-apps-screen-leave"
      exist
      visible={allAppsScreen}
    >
      <div
        style={{ paddingRight: defaultDesktop.sidebar }}
        className={allAppScreenClassName}
      >
        <div
          style={{ paddingTop: defaultDesktop.navbar }}
          className="relative w-full h-full"
        >
          <div className="flex p-5 align-center justify-center">
            <SearchInput placeholder="Type to Search..." />
          </div>
          {/* apps */}
          <div className="flex flex-wrap">
            {active === 'Frequent'
              ? frequentApps.map((app) => (
                  <App key={app.id} onOpen={onAppOpen} app={app} />
                ))
              : apps.map((app) => (
                  <App key={app.id} onOpen={onAppOpen} app={app} />
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
    </Transition>
  )
}

export default AllAppsScreen
