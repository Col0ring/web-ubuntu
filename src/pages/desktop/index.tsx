import React from 'react'
import BackgroundImage from './components/background-image'
import { useDesktopContext, withDesktopProvider } from './provider'
import AllAppsScreen from './screens/all-apps-screen'
import Navbar from './components/navbar'
import Sidebar from './components/sidebar'

const Desktop: React.FC = () => {
  const [desktopState] = useDesktopContext()
  return (
    <div className="h-full w-full flex flex-col items-end justify-start content-start flex-wrap-reverse pt-8 bg-transparent relative overflow-hidden overscroll-none">
      <BackgroundImage type={desktopState.backgroundImage} />
      <Navbar />
      <Sidebar />
      {desktopState.allAppsScreen && <AllAppsScreen />}
    </div>
  )
}
export default withDesktopProvider(Desktop)
