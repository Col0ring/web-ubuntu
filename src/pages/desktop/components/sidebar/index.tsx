import React, { useCallback, useMemo } from 'react'
import classnames from 'classnames'
import { obj2arr } from '@/utils/tool'
import { AppConfig } from '@/typings/app'
import SidebarApp, { SidebarAppProps } from './sidebar-app'
import { useDesktopContext } from '../../provider'
import SidebarArea from './sidebar-area'
import AllAppsButton, { AllAppsButtonProps } from './all-apps-button'

const Sidebar: React.FC = () => {
  const [{ apps, openedApps, minimizedApps, allAppsScreen }, desktopMethods] =
    useDesktopContext()
  const sidebarClassName = classnames(
    'select-none absolute transform duration-300 z-40 right-0 top-0 h-full pt-7 w-auto flex flex-col justify-start items-center border-black border-opacity-60 bg-black bg-opacity-50',
    {
      '-translate-x-full': false
    }
  )
  const noFavoriteMinimizedAppsArr = useMemo(
    () => obj2arr(minimizedApps).filter((app) => app && !app.favorite),
    [minimizedApps]
  ) as AppConfig[]

  const onAppClick: Required<SidebarAppProps>['onClick'] = useCallback(
    (id, app) => {
      desktopMethods.openApp(id, app)
    },
    [desktopMethods]
  )

  const onAllAppButtonClick: Required<AllAppsButtonProps>['onClick'] =
    useCallback(() => {
      desktopMethods.setAllAppsScreen(!allAppsScreen)
    }, [allAppsScreen])

  return (
    <>
      <SidebarArea />
      <div className={sidebarClassName}>
        {apps
          .filter((app) => app.favorite)
          .map((app) => (
            <SidebarApp
              isOpen={!!openedApps[app.id]}
              isMinimized={!!minimizedApps[app.id]}
              onClick={onAppClick}
              key={app.id}
              app={app}
            />
          ))}
        {noFavoriteMinimizedAppsArr.map((app) => (
          <SidebarApp
            isOpen={!!openedApps[app.id]}
            isMinimized={!!minimizedApps[app.id]}
            onClick={onAppClick}
            key={app.id}
            app={app}
          />
        ))}
        <AllAppsButton onClick={onAllAppButtonClick} />
      </div>
    </>
  )
}

export default Sidebar
