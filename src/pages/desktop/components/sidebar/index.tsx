import React, { useCallback } from 'react'
import classnames from 'classnames'
import SidebarApp, { SidebarAppProps } from './sidebar-app'
import { useDesktopContext } from '../../provider'
import SidebarArea from './sidebar-area'
import AllAppsButton from './all-apps-button'

const Sidebar: React.FC = () => {
  const [{ apps, openApps }, desktopMethods] = useDesktopContext()
  const sidebarClassName = classnames(
    'select-none absolute transform duration-300 z-40 left-0 top-0 h-full pt-7 w-auto flex flex-col justify-start items-center border-black border-opacity-60 bg-black bg-opacity-50',
    {
      '-translate-x-full': false
    }
  )

  const onAppClick: Required<SidebarAppProps>['onClick'] = useCallback(
    (id, app) => {
      desktopMethods.openNewApp(id, app)
    },
    [desktopMethods]
  )

  return (
    <>
      <SidebarArea />
      <div className={sidebarClassName}>
        {apps
          .filter((app) => app.favorite)
          .map((app) => (
            <SidebarApp
              isOpen={!!openApps[app.id]}
              onClick={onAppClick}
              key={app.id}
              app={app}
            />
          ))}
        <AllAppsButton />
      </div>
    </>
  )
}

export default Sidebar
