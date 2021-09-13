import React, { useCallback, useMemo } from 'react'
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
import { SpecialFolder } from './constants'
import { FolderConfig } from '@/typings/app'
import { DragArea } from '@/components/dragging'

const Desktop: React.FC = () => {
  const [desktopState, desktopMethods] = useDesktopContext()

  const onDesktopAppOpen: Required<DesktopAppProps>['onOpen'] = useCallback(
    (id, app) => {
      desktopMethods.openApp(id, app)
    },
    [desktopMethods]
  )
  const desktopApps = useMemo(
    () =>
      (desktopState.appMap[SpecialFolder.Desktop] as FolderConfig).apps.map(
        (app) => desktopState.appMap[app.id]
      ),
    [desktopState.appMap]
  )
  useEventListener(window, 'resize', () => {
    desktopMethods.resizeBrowserWindow(window.innerWidth, window.innerHeight)
  })

  return (
    <DesktopContextmenu>
      <BackgroundImage src={desktopState.backgroundImage} />
      <DragArea>
        {/* desktop apps */}
        {desktopApps.map((app) => (
          <DesktopApp onOpen={onDesktopAppOpen} app={app} key={app.id} />
        ))}
      </DragArea>
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
    </DesktopContextmenu>
  )
}
export default withDesktopProvider(Desktop)
