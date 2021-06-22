import React, { useMemo } from 'react'
import BackgroundImage from './components/background-image'
import { useDesktopContext, withDesktopProvider } from './provider'
import AllAppsScreen from './screens/all-apps-screen'
import Navbar from './components/navbar'
import Sidebar from './components/sidebar'
import DesktopApp from './components/desktop-app'
import LockScreen from './screens/lock-screen'
import AppWindow from './components/app-window'
import { obj2arr } from '@/utils/tool'

const Desktop: React.FC = () => {
  const [desktopState] = useDesktopContext()
  const openedAppsArr = useMemo(
    () => obj2arr(desktopState.openedApps),
    [desktopState.openedApps]
  )
  return (
    <div className="h-full w-full flex flex-col justify-start content-start flex-wrap  pt-8 bg-transparent relative overflow-hidden overscroll-none">
      <BackgroundImage src={desktopState.backgroundImage} />
      {desktopState.apps
        .filter((app) => app.shortcut)
        .map((app) => (
          <DesktopApp app={app} key={app.id} />
        ))}
      <Navbar />
      <Sidebar />
      {openedAppsArr.map((app) => {
        return (
          app && (
            <AppWindow
              isFocus={desktopState.focusAppId === app.id}
              isMaximized={!!desktopState.maximizedApps[app.id]}
              isMinimized={!!desktopState.minimizedApps[app.id]}
              key={app.id}
              app={app}
            />
          )
        )
      })}

      <AllAppsScreen />
      <LockScreen />
    </div>
  )
}
export default withDesktopProvider(Desktop)
