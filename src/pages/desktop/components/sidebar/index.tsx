import React, { useCallback, useMemo, useState } from 'react'
import classnames from 'classnames'
import Transition from '@/components/transition'
import { obj2arr } from '@/utils/tool'
import { AppConfig } from '@/typings/app'
import SidebarApp, { SidebarAppProps } from './sidebar-app'
import { useDesktopContext } from '../../provider'
import SidebarArea from './sidebar-area'
import AllAppsButton, { AllAppsButtonProps } from './all-apps-button'
import './style.less'

const Sidebar: React.FC = () => {
  const [
    { apps, openedApps, minimizedApps, allAppsScreen, sidebar },
    desktopMethods
  ] = useDesktopContext()
  const [forceSidebarRender, setForceSidebarRender] = useState(false)
  const sidebarClassName = classnames(
    'desktop-sidebar select-none h-full pt-7 flex flex-col justify-start items-center border-black border-opacity-60 bg-black bg-opacity-50'
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
    <SidebarArea
      onEnter={() => {
        setForceSidebarRender(true)
      }}
      onLeave={() => {
        setForceSidebarRender(false)
      }}
    >
      <Transition
        duration={500}
        enterClassName="desktop-sidebar-show"
        leaveClassName="desktop-sidebar-leave"
        exist
        visible={forceSidebarRender || sidebar}
      >
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
      </Transition>
    </SidebarArea>
  )
}

export default Sidebar
