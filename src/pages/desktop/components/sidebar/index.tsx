import React from 'react'
import classnames from 'classnames'
import SidebarApp from './sidebar-app'
import { useDesktopContext } from '../../provider'
import SidebarArea from './sidebar-area'

const Sidebar: React.FC = () => {
  const [{ apps }] = useDesktopContext()
  const sidebarClassName = classnames(
    'select-none absolute transform duration-300 z-40 left-0 top-0 h-full pt-7 w-auto flex flex-col justify-start items-center border-black border-opacity-60 bg-black bg-opacity-50',
    {
      '-translate-x-full': false
    }
  )

  return (
    <>
      <SidebarArea />
      <div className={sidebarClassName}>
        {apps
          .filter((app) => app.favorite)
          .map((app) => (
            <SidebarApp key={app.id} app={app} />
          ))}
        {/* <AllApps showApps={props.showAllApps} /> */}
      </div>
    </>
  )
}

export default Sidebar
