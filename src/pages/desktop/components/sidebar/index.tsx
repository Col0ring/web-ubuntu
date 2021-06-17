import React, { useRef } from 'react'
import classnames from 'classnames'
import SidebarApp from './sidebar-app'
import { useDesktopContext } from '../../provider'
import useHover from '@/hooks/common/useHover'

const Sidebar: React.FC = () => {
  const [{ apps }] = useDesktopContext()
  const SidebarAreaRef = useRef<HTMLDivElement | null>(null)
  const sidebarClassName = classnames(
    'select-none absolute transform duration-300 z-40 left-0 top-0 h-full pt-7 w-auto flex flex-col justify-start items-center border-black border-opacity-60 bg-black bg-opacity-50',
    {
      '-translate-x-full': false
    }
  )

  useHover(SidebarAreaRef)

  return (
    <>
      <div
        ref={SidebarAreaRef}
        // onMouseEnter={showSideBar}
        // onMouseLeave={hideSideBar}
        className="w-1 h-full absolute top-0 left-0 bg-transparent z-50 opacity-0"
      ></div>
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
