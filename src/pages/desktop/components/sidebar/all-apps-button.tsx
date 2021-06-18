import React from 'react'
import Tooltip from '@/components/tooltip'
export interface AllAppsButton {
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const AllAppsButton: React.FC<AllAppsButton> = ({ onClick }) => {
  return (
    <div className="absolute bottom-0">
      <Tooltip title="Show Applications">
        <div
          className="w-10 h-10 rounded m-1 hover:bg-white hover:bg-opacity-10 flex items-center justify-center"
          onClick={onClick}
        >
          <img
            className="w-7"
            src="/themes/Yaru/system/view-app-grid-symbolic.svg"
            alt="Ubuntu view app"
          />
        </div>
      </Tooltip>
    </div>
  )
}

export default AllAppsButton
