import React, { useCallback } from 'react'
import classnames from 'classnames'
import { dataTarget } from '../../../../desktop/config'
import { stopPropagation } from '@/utils/misc'
import { addBase } from '@/utils/prod'

export interface EditButtonsProps {
  className?: string
  onMinimize?: React.MouseEventHandler<HTMLButtonElement>
  onMaximize?: (
    isMaximized: boolean,
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void
  isMaximized?: boolean
  onClose?: React.MouseEventHandler<HTMLButtonElement>
}
const EditButtons: React.FC<EditButtonsProps> = ({
  isMaximized,
  onMaximize,
  onMinimize,
  onClose,
  className,
}) => {
  const onMaximizeButtonClick: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(
      (e) => {
        onMaximize?.(!isMaximized, e)
      },
      [onMaximize, isMaximized]
    )
  const editButtonsClassName = classnames(
    className,
    'flex justify-center items-center'
  )
  return (
    <div
      onClick={stopPropagation}
      data-target={dataTarget.editButtons}
      className={editButtonsClassName}
    >
      <button
        className="focus:outline-none cursor-default mx-1.5 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center h-5 w-5 items-center"
        onClick={onMinimize}
      >
        <img
          draggable={false}
          src={addBase('/themes/Yaru/window/window-minimize-symbolic.svg')}
          alt="ubuntu window minimize"
        />
      </button>
      <button
        className="focus:outline-none cursor-default mx-1.5 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center  h-5 w-5 items-center"
        onClick={onMaximizeButtonClick}
      >
        {isMaximized ? (
          <img
            draggable={false}
            src={addBase('/themes/Yaru/window/window-restore-symbolic.svg')}
            alt="ubuntu window restore"
          />
        ) : (
          <img
            draggable={false}
            src={addBase('/themes/Yaru/window/window-maximize-symbolic.svg')}
            alt="ubuntu window maximize"
          />
        )}
      </button>
      <button
        className="mx-1.5 focus:outline-none cursor-default bg-ub-orange bg-opacity-90 hover:bg-opacity-100 rounded-full flex justify-center h-5 w-5 items-center"
        onClick={onClose}
      >
        <img
          draggable={false}
          src={addBase('/themes/Yaru/window/window-close-symbolic.svg')}
          alt="ubuntu window close"
        />
      </button>
    </div>
  )
}

export default EditButtons
