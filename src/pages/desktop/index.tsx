import React from 'react'
import BackgroundImage from './components/background-image'
import { useDesktopContext, withDesktopProvider } from './provider'
import AllAppsScreen from './screens/all-apps-screen'
import Navbar from './components/navbar'
import Sidebar from './components/sidebar'
import LockScreen from './screens/lock-screen'
import AppWindow from './components/app-window'
import useEventListener from '@/hooks/common/useEventListener'
import NewFolderModal from './components/new-folder-modal'
import DesktopFolder from './components/desktop-folder'

const Desktop: React.FC = () => {
  const [desktopState, desktopMethods] = useDesktopContext()
  useEventListener(window, 'resize', () => {
    desktopMethods.resizeBrowserWindow(window.innerWidth, window.innerHeight)
  })
  return (
    <>
      <BackgroundImage src={desktopState.backgroundImage} />
      <DesktopFolder />
      <Navbar />
      <Sidebar />
      {/* app windows */}
      {desktopState.openedApps.map((app) => {
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
    </>
  )
}
export default withDesktopProvider(Desktop)
