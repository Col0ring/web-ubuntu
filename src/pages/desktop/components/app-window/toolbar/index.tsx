import React, { useCallback } from 'react'
import classnames from 'classnames'
import EditButtons, { EditButtonsProps } from './edit-buttons'
import { dataTarget } from '../../../../desktop/config'

export interface ToolbarProps extends EditButtonsProps {
  title: string
}

const Toolbar: React.FC<ToolbarProps> = ({
  title,
  className,
  ...editButtonsProps
}) => {
  const toolbarClassName = classnames(
    'bg-ub-window-title border-white border-opacity-5 py-1.5 text-white w-full select-none flex  justify-center items-center',
    className
  )
  const onToolbarDoubleClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(
      (e) => {
        editButtonsProps.onMaximize?.(!editButtonsProps.isMaximized, e)
      },
      [editButtonsProps]
    )
  return (
    <div
      data-target={dataTarget.toolbar}
      onDoubleClick={onToolbarDoubleClick}
      style={{
        paddingLeft: 100,
        paddingRight: 100,
      }}
      className={toolbarClassName}
    >
      <div className="flex justify-center text-sm font-bold">{title}</div>
      <EditButtons className="absolute top-1 right-1" {...editButtonsProps} />
    </div>
  )
}

export default Toolbar
