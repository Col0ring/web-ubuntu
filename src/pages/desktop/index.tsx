import React, { useCallback, useRef } from 'react'
import BackgroundImage from './components/background-image'
import { useDesktopContext, withDesktopProvider } from './provider'
import AllAppsScreen from './screens/all-apps-screen'
import Navbar from './components/navbar'
import Sidebar from './components/sidebar'
import DesktopApp, { DesktopAppProps } from './components/desktop-app'
import LockScreen from './screens/lock-screen'
import AppWindow from './components/app-window'
import useEventListener from '@/hooks/common/useEventListener'
import DesktopContextmenu from './components/desktop-contextmenu'
import NewFolderModal from './components/new-folder-modal'

const Desktop: React.FC = () => {
  const [desktopState, desktopMethods] = useDesktopContext()

  const onDesktopAppOpen: Required<DesktopAppProps>['onOpen'] = useCallback(
    (id, app) => {
      desktopMethods.openApp(app.id, app)
    },
    [desktopMethods]
  )

  useEventListener(window, 'resize', () => {
    desktopMethods.resizeWindow(window.innerWidth, window.innerHeight)
  })

  return (
    <DesktopContextmenu>
      <BackgroundImage src={desktopState.backgroundImage} />
      {/* desktop apps */}
      {desktopState.desktopApps.map((app) => (
        <DesktopApp onOpen={onDesktopAppOpen} app={app} key={app.id} />
      ))}
      <Navbar />
      <Sidebar />
      {/* app windows */}
      {desktopState.openedAppsArr.map((app) => {
        return (
          <AppWindow
            isFocus={desktopState.focusAppId === app.id}
            isMaximized={!!desktopState.maximizedApps[app.id]}
            isMinimized={!!desktopState.minimizedApps[app.id]}
            key={app.id}
            app={app}
          />
        )
      })}

      <AllAppsScreen />
      <LockScreen />
      {/* new-folder-modal */}
      {desktopState.newFolderModal && <NewFolderModal />}
    </DesktopContextmenu>
  )
}
export default withDesktopProvider(Desktop)
