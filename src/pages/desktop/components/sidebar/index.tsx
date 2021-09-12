import React, { useCallback, useMemo, useState } from 'react'
import classnames from 'classnames'
import Transition from '@/components/transition'
import { obj2arr } from '@/utils/tool'
import { AppConfig } from '@/typings/app'
import SidebarApp, { SidebarAppProps } from './sidebar-app'
import { useDesktopContext } from '../../provider'
import SidebarArea, { SidebarAreaProps } from './sidebar-area'
import AllAppsButton, { AllAppsButtonProps } from './all-apps-button'
import './style.less'
import { defaultDesktop } from '../../config'

const Sidebar: React.FC = () => {
  const [
    { favoriteApps, openedAppMap, openedApps, minimizedApps, allAppsScreen },
    desktopMethods,
  ] = useDesktopContext()
  const [forceSidebarRender, setForceSidebarRender] = useState(false)
  const sidebarClassName = classnames(
    'desktop-sidebar select-none h-full pt-7 flex flex-col justify-start items-center border-black border-opacity-60 bg-black bg-opacity-50'
  )
  const noFavoriteMinimizedAppsArr = useMemo(
    () =>
      obj2arr(minimizedApps).filter(
        (app) => !favoriteApps.find((favoriteApp) => favoriteApp.id === app.id)
      ),
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

  const sidebarAreaMethods: Required<SidebarAreaProps> = useMemo(
    () => ({
      onEnter: () => {
        setForceSidebarRender(true)
      },
      onLeave: () => {
        setForceSidebarRender(false)
      },
    }),
    [setForceSidebarRender]
  )

  const sidebar = useMemo(() => {
    return openedApps.every((app) => {
      if (!app || minimizedApps[app.id]) {
        return true
      }
      const width =
        typeof app.rect.width === 'number'
          ? app.rect.width
          : (window.innerWidth * Number.parseFloat(`${app.rect.width}`)) / 100
      const left =
        typeof app.windowPosition.left === 'number'
          ? app.windowPosition.left
          : (window.innerWidth *
              Number.parseFloat(`${app.windowPosition.left}`)) /
            100
      return left < window.innerWidth - width - defaultDesktop.sidebar
    })
  }, [openedApps, minimizedApps])
  return (
    <SidebarArea
      // if the window is maximized,can not enter
      {...sidebarAreaMethods}
    >
      <Transition
        duration={500}
        enterClassName="desktop-sidebar-show"
        leaveClassName="desktop-sidebar-leave"
        exist
        visible={forceSidebarRender || sidebar}
      >
        <div className={sidebarClassName}>
          {favoriteApps.map((app) => (
            <SidebarApp
              isOpen={!!openedAppMap[app.id]}
              isMinimized={!!minimizedApps[app.id]}
              onClick={onAppClick}
              key={app.id}
              app={app}
            />
          ))}
          {noFavoriteMinimizedAppsArr.map((app) => (
            <SidebarApp
              isOpen={!!openedAppMap[app.id]}
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
